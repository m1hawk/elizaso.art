import {agentId, findUnverifiedNFTsByAgentId, getCollections} from "@/app/api/nftCollection";
import {Network} from "@prisma/client";
import {NextRequest} from "next/server";

export async function GET(request: NextRequest
) {
  const page = Number(request.nextUrl.searchParams.get("page") || 1)
  const pageSize = Number(request.nextUrl.searchParams.get("pageSize") || 10)
  const networkId = (request.nextUrl.searchParams.get("networkId") || Network.SOLANA_DEVNET) as Network;
  const res = await findUnverifiedNFTsByAgentId({
    agentId,
    networkId
  }, {
    page,
    pageSize
  })
  return Response.json({success: true, data: res})
}