import {agentId, createNFT, creators, getCollectionsByAgent, getNextTokenId, updateNFT} from "@/app/api/nftCollection";
import {Network} from "@prisma/client";
import {NextRequest} from "next/server";
import {apiRequest} from "@/app/api/services";

export async function POST(request: NextRequest
) {
  const networkId = (Network.SOLANA_DEVNET) as Network;
  const collections = await getCollectionsByAgent(agentId)
  if (collections.total > 0) {
    const collection = collections.data[0]
    const nextTokenId = await getNextTokenId(collection.address);
    await createNFT({
      networkId: networkId,
      tokenId: nextTokenId,
      collectionAddress: collection.address
    })
    const nftInfo = await apiRequest.post('/api/nft-generation/create-nft-metadata', {
      agentId,
      collectionName: collection.name,
      collectionAddress: collection.address,
      collectionAdminPublicKey: collection.authority,
      collectionFee: collection.sellerFeeBasisPoints,
      tokenId: nextTokenId
    })
    await updateNFT({
      networkId: networkId,
      tokenId: nextTokenId,
      collectionAddress: nftInfo.collectionAddress,
    }, {
      name: nftInfo.name,
      symbol: nftInfo.symbol,
      authority: nftInfo.adminPublicKey,
      metadataUri: nftInfo.uri,
      imageUri: nftInfo.imageUri,
      creators,
    })
    return Response.json({
      success: true, data: nftInfo
    })
  } else {
    return Response.json({
      success: false, data: false
    })
  }

}


