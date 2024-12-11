import prisma from '../lib/prisma'

export async function GET() {
  // const res = await fetch('https://data.mongodb-api.com/...', {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'API-Key': process.env.DATA_API_KEY,
  //   },
  // })
  // const data = await res.json()
  const users = await prisma.user.findMany()
  console.log(prisma.user, users)

  return Response.json({ data: users })
}