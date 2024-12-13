import {agentId, createCollection, creators, getCollections, getCollectionsByAgent} from "@/app/api/nftCollection";
import {Network} from "@prisma/client";
import {NextRequest} from "next/server";
import {apiRequest} from "@/app/api/services";

export async function POST(request: NextRequest
) {
  const networkId = (Network.SOLANA_DEVNET) as Network;
  const collections = await getCollectionsByAgent(agentId)
  if (collections.total > 0) {
    const collection = collections.data[0]
    return Response.json({data: collection})
  }
  const res = await apiRequest.post('/api/nft-generation/create-collection', {
    agentId
  })

  await createCollection({
    agentId,
    networkId,
    address: res.address,
    supply: res.supply,
    mintPrice: res.mintPrice,
    name: res.collectionInfo.name,
    symbol: res.collectionInfo.symbol,
    authority: res.collectionInfo.adminPublicKey,
    sellerFeeBasisPoints: res.collectionInfo.fee,
    metadataUri: res.collectionInfo.uri,
    creators,
  })
  return Response.json({
    success: true, data: res
  })
}