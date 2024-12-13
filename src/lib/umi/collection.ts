import {generateSigner, percentAmount, publicKey, sol, TransactionBuilder} from "@metaplex-foundation/umi";
import {transferSol} from "@metaplex-foundation/mpl-toolbox";
import {createNft, mplTokenMetadata, updateV1} from "@metaplex-foundation/mpl-token-metadata";
import {getExplorerLink} from "@solana-developers/helpers";
import umiWithCurrentWalletAdapter from "@/lib/umi/umiWithCurrentWalletAdapter";

export async function mintNFT({
                                mintPrice,
                         collectionAddress,
                         adminPublicKey,
                         name,
                         uri,
                         fee,
                       }: {
  mintPrice: number;
  collectionAddress: string;
  adminPublicKey: string;
  name: string;
  uri: string;
  fee: number;
}):Promise<{
  address: string;
  link:string;
  tx: any
}> {

  const umi = umiWithCurrentWalletAdapter();
  umi.use(mplTokenMetadata());
  const mint = generateSigner(umi);

  let transaction = new TransactionBuilder();
  console.log("collectionAddress", collectionAddress);
  const collectionAddressKey = publicKey(collectionAddress);
  // Add SOL transfer instruction (0.1 SOL)
  const receiverAddressKey = publicKey(adminPublicKey); // Replace with actual receiver address
  transaction = transaction.add(
          transferSol(umi, {
            source: umi.identity,
            destination: receiverAddressKey,
            amount: sol(mintPrice),
          })
  );
  const info = {
    name,
    uri,
  };
  transaction = transaction.add(
          createNft(umi, {
            mint,
            ...info,
            sellerFeeBasisPoints: percentAmount(fee),
            collection: {
              key: collectionAddressKey,
              verified: false,
            },
          })
  );

  transaction = transaction.add(
          updateV1(umi, {
            mint: mint.publicKey,
            newUpdateAuthority: publicKey(adminPublicKey), // updateAuthority's public key
          })
  );

  const tx = await transaction.sendAndConfirm(umi);
  //
  // await sleep();
  // const createdNft = await fetchDigitalAsset(umi, mint.publicKey);
  //
  // console.log(
  //     `🖼️ Created NFT! Address is ${getExplorerLink(
  //         "address",
  //         createdNft.mint.publicKey,
  //         "devnet"
  //     )}`
  // );
  const address = mint.publicKey

  return {
    link: getExplorerLink("address", address, "devnet"),
    address,
    tx
  };
}