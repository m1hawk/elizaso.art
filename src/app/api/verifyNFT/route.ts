import {
  agentId,
  getNFTDetail,
  getNFTVerificationStatus,
  updateNFT,
  updateNFTVerificationStatus
} from "@/app/api/nftCollection";
import {VerificationStatus} from "@prisma/client";
import {NextRequest} from "next/server";
import {
  amountToNumber,
  Cluster,
  subtractAmounts,
  TransactionSignature,
  TransactionWithMeta,
  Umi
} from "@metaplex-foundation/umi";
import {base58} from "@metaplex-foundation/umi/serializers";
import {clusterApiUrl, Connection} from "@solana/web3.js";
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults";
import {apiRequest} from "@/app/api/services";


interface TransactionAmount {
  receiverAmount: number;
  receiverAddress: string;
  detail: TransactionWithMeta | null
}

async function getTransactionAmount(
        signature: TransactionSignature,
        receiverAddress: string
): Promise<TransactionAmount> {
  try {
    const cluster = "devnet";
    const connection = new Connection(clusterApiUrl(cluster), {
      commitment: "finalized",
    });
    const umi = createUmi(connection.rpcEndpoint);

    const tx = await umi.rpc.getTransaction(signature);

    if (!tx) {
      throw new Error('Transaction not found');
    }

    if (!tx.meta) {
      throw new Error('Transaction metadata not found');
    }

    // 找到接收者地址在账户列表中的索引
    const accountIndex = tx.message.accounts.findIndex(
            (key) => key.toString() === receiverAddress
    );

    if (accountIndex === -1) {
      throw new Error(`Receiver address ${receiverAddress} not found in transaction`);
    }

    const preBalance = tx.meta.preBalances[accountIndex];
    const postBalance = tx.meta.postBalances[accountIndex];
    console.log(amountToNumber(preBalance),);

    // if (typeof preBalance !== 'number' || typeof postBalance !== 'number') {
    //   throw new Error('Balance information not available');
    // }

    // const amountInLamports = postBalance - preBalance;
    // const amountInSol = amountInLamports / 1e9;

    // 获取交易时间戳

    return {
      receiverAmount: amountToNumber(subtractAmounts(postBalance, preBalance)),
      // amountInLamports,
      // amountInSol,
      receiverAddress,
      detail: tx
    };
  } catch (error: any) {
    throw new Error(`Failed to get transaction amount: ${error?.message}`);
  }
}

// 字符串转 TransactionSignature
const toTransactionSignature = (txAddress: string): TransactionSignature => {
  return base58.serialize(txAddress) as TransactionSignature;
}

export async function POST(request: NextRequest
) {
  const formData = await request.json();
  const tx = formData.tx
  const nftId = formData.nftId
  const nft = await getNFTDetail(nftId)
  if (nft?.verificationStatus === VerificationStatus.SUCCESS) {
    return Response.json({
      success: false,
      data: null,
      msg: 'already verified'
    })
  }
  const nftMintPrice = nft?.collection?.mintPrice || 0
  // PDbdqMr2VsEmCuMAvUY8ptCxiDBXWPNRDiSsdWbpERRaCRYiAZeuUxmD15LDCrJpCXV66dg9j5SreNS2PMzjsZc
  const deserializedCreateAssetTxAsU8 = toTransactionSignature(tx);
  let txData = null
  if (nft?.collection?.authority) {
    txData = await getTransactionAmount(deserializedCreateAssetTxAsU8, nft?.collection?.authority)
  }
  if (nftMintPrice <= (txData?.receiverAmount || 0)) {
    const nftAddress = txData?.detail?.message?.accounts[1]
    const userAddress = txData?.detail?.message?.accounts[0]
    const res = await apiRequest.post('/api/nft-generation/verify-nft', {
      agentId,
      collectionAddress: nft?.collectionAddress,
      collectionAdminPublicKey: nft?.collection?.authority,
      nftAddress,
      token: 'v8bAQWbqxYWdGUe42sVY4mNgpn'
    })
    console.log(res);
    await updateNFT({
      id: nftId
    }, {
      address: userAddress,
      creators: userAddress ? [userAddress] : [],
      verificationStatus: VerificationStatus.SUCCESS
    })
    return Response.json({
      success: true,
      data: {nft, txData: null},
    })
  } else {
    return Response.json({
      success: false,
      data: null,
      msg: 'price error'
    })
  }

}