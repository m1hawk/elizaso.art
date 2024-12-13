import {getNFTVerificationStatus, updateNFTVerificationStatus} from "@/app/api/nftCollection";
import {VerificationStatus} from "@prisma/client";
import {NextRequest} from "next/server";

export async function POST(request: NextRequest
) {
  const formData = await request.json();
  const id = formData.id
  const status = await getNFTVerificationStatus(id)
  if (status.verificationStatus) {
    return Response.json({
      success: false,
      msg: 'nft is locked.'
    })
  }
  const res = await updateNFTVerificationStatus(id, VerificationStatus.SELECTED)
  return Response.json({
    success: true,
    data: res
  })
}