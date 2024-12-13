// api/fetchUser.ts

import {Network, VerificationStatus} from '@prisma/client';
import prisma from '../lib/prisma'

export const agentId = '66108e9f-b7ea-0ba3-876c-395fc7ea6fd4'
export const creators = ['BMXEwzXCva42NefC8zhmW5qSbLEKp4hXFzf81xBfDD9A']
export const getCollections = async (
        page: number = 1,
        pageSize: number = 10,
        networkId?: Network
) => {
  const skip = (page - 1) * pageSize;

  const [total, collections] = await prisma.$transaction([
    // 获取总数
    prisma.collection.count({
      where: networkId ? {networkId} : undefined,
    }),
    // 获取数据
    prisma.collection.findMany({
      where: networkId ? {networkId} : undefined,
      skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc', // 按创建时间倒序
      },
      include: {
        _count: {
          select: {nfts: true} // 获取 NFT 数量
        }
      }
    })
  ]);

  return {
    total,
    data: collections,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
};


export const createCollection = async (
        {
          networkId,
          address,
          name,
          agentId,
          symbol,
          authority,
          sellerFeeBasisPoints,
          metadataUri,
          creators,
          supply,
          mintPrice
        }: {
          networkId: Network,
          address: string,
          name: string,
          agentId: string,
          symbol: string,
          authority: string,
          sellerFeeBasisPoints: number,
          metadataUri: string,
          creators: string[],
          supply: number,
          mintPrice: number,
        }) => {
  const collection = await prisma.collection.create({
    data: {
      networkId,
      address,
      name,
      agentId,
      symbol,
      authority,
      sellerFeeBasisPoints,
      metadataUri,
      creators,
      supply,
      mintPrice,
    },
  });

  console.log('create', collection);
}

// 验证 UUID 格式的工具函数
const isValidUUID = (uuid: string) => {
  // const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  // return uuidRegex.test(uuid);
  return !!uuid
};
export const getCollectionsByAgent = async (
        agentId: string,
        page: number = 1,
        pageSize: number = 10,
        networkId?: Network
) => {
  if (!isValidUUID(agentId)) {
    throw new Error('Invalid UUID format for agentId');
  }

  const skip = (page - 1) * pageSize;

  const [total, collections] = await prisma.$transaction([
    prisma.collection.count({
      where: {
        agentId,
        ...(networkId && {networkId})
      },
    }),
    prisma.collection.findMany({
      where: {
        agentId,
        ...(networkId && {networkId})
      },
      skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {nfts: true}
        }
      }
    })
  ]);

  return {
    total,
    data: collections,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
};


export const getNextTokenId = async (collectionAddress: string): Promise<number> => {
  try {
    // 查询该 collection 下的所有 NFT，按 tokenId 降序排序，只取第一条
    const lastNft = await prisma.nFT.findFirst({
      where: {
        collectionAddress
      },
      orderBy: {
        tokenId: 'desc'
      }
    });

    // 如果没有找到 NFT，返回 1
    if (!lastNft) {
      return 1;
    }

    // 找到了最后一个 NFT，返回 tokenId + 1
    return lastNft.tokenId + 1;
  } catch (error) {
    console.error('Error getting next tokenId:', error);
    throw error;
  }
};


// 定义必需的 NFT 输入接口
interface NFTCreateInput {
  networkId: Network
  tokenId: number
  address?: string | null
  name?: string | null
  symbol?: string | null
  authority?: string | null
  metadataUri?: string | null
  imageUri?: string | null
  creators?: string[] | null
  verificationStatus?: VerificationStatus | null
  collectionAddress?: string | null
}


// 单个 NFT 插入函数
export async function createNFT(input: NFTCreateInput) {
  try {
    // 验证必需字段
    if (input.networkId === undefined || input.tokenId === undefined) {
      throw new Error('networkId and tokenId are required')
    }

    // 构建创建数据对象
    const createData: NFTCreateInput = {
      networkId: input.networkId,
      tokenId: input.tokenId,
    }

    // 添加可选字段（只有当字段有值时才添加）
    if (input.address !== undefined && input.address !== null) {
      createData.address = input.address
    }
    if (input.name !== undefined && input.name !== null) {
      createData.name = input.name
    }
    if (input.symbol !== undefined && input.symbol !== null) {
      createData.symbol = input.symbol
    }
    if (input.authority !== undefined && input.authority !== null) {
      createData.authority = input.authority
    }
    if (input.metadataUri !== undefined && input.metadataUri !== null) {
      createData.metadataUri = input.metadataUri
    }
    if (input.imageUri !== undefined && input.imageUri !== null) {
      createData.imageUri = input.imageUri
    }
    if (input.creators !== undefined && input.creators !== null) {
      createData.creators = input.creators
    }
    if (input.verificationStatus !== undefined && input.verificationStatus !== null) {
      createData.verificationStatus = input.verificationStatus
    }
    if (input.collectionAddress !== undefined && input.collectionAddress !== null) {
      createData.collectionAddress = input.collectionAddress
    }

    // 创建 NFT
    const nft = await prisma.nFT.create({
      data: createData as never,
    })

    return nft
  } catch (error) {
    // console.error('Error creating NFT:', error)
    throw error
  }
}

// 定义更新数据的接口
interface NFTUpdateInput {
  address?: string | null
  name?: string | null
  symbol?: string | null
  authority?: string | null
  metadataUri?: string | null
  imageUri?: string | null
  creators?: string[] | null
  verificationStatus?: VerificationStatus | null
}

// 更新 NFT 函数
export async function updateNFT(
        // 查询条件
        where: {
          id: string
        },
        // 更新数据
        updateData: NFTUpdateInput
) {
  try {
    // 首先验证 NFT 是否存在
    const existingNFT = await prisma.nFT.findFirst({
      where: {
        id: where.id,
      }
    })

    if (!existingNFT) {
      throw new Error(
              `NFT not found with id: ${where.id}, `
      )
    }

    // 构建更新数据对象，只包含非 undefined 字段
    const data: any = {}

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        data[key] = value
      }
    })
    // 执行更新
    const updatedNFT = await prisma.nFT.update({
      where: {
        id: existingNFT.id
      },
      data: data
    })

    return updatedNFT
  } catch (error) {
    console.error('Error updating NFT:', error)
    throw error
  }
}

interface PaginationParams {
  page: number      // 页码，从1开始
  pageSize: number  // 每页数量
}

interface QueryResult<T> {
  items: T[]        // 当前页的数据
  pagination: {
    total: number   // 总记录数
    page: number    // 当前页码
    pageSize: number// 每页数量
    totalPages: number // 总页数
  }
}

export async function findUnverifiedNFTsByAgentId(
        where: {
          agentId: string
          networkId?: Network
        },
        pagination: PaginationParams
): Promise<QueryResult<unknown>> {
  try {
    // 验证并规范化分页参数
    const page = Math.max(1, pagination.page) // 确保页码最小为1
    const pageSize = Math.max(1, Math.min(100, pagination.pageSize)) // 限制每页大小在1-100之间
    const skip = (page - 1) * pageSize

    // 查询数据
    const [nfts, total] = await prisma.$transaction([
      // 查询当前页的数据
      prisma.nFT.findMany({
        where: {
          collection: {
            agentId: where.agentId
          },
          ...(where.networkId && {networkId: where.networkId}),
          verificationStatus: null
        },
        orderBy: [
          {
            collectionAddress: 'asc'
          },
          {
            tokenId: 'asc'
          }
        ],
        skip: skip,
        take: pageSize,
        select: {
          id: true,
          networkId: true,
          collectionAddress: true,
          tokenId: true,
          address: true,
          name: true,
          symbol: true,
          metadataUri: true,
          imageUri: true,
          creators: true,
          verificationStatus: true,
          createdAt: true,
          collection: {
            select: {
              agentId: true,
              name: true,
              symbol: true,
              authority: true,
              sellerFeeBasisPoints: true,
              supply: true,
              mintPrice: true,
            }
          }
        }
      }),
      // 查询总记录数
      prisma.nFT.count({
        where: {
          collection: {
            agentId: where.agentId
          },
          ...(where.networkId && {networkId: where.networkId}),
          verificationStatus: null
        }
      })
    ])

    // 计算总页数
    const totalPages = Math.ceil(total / pageSize)

    return {
      items: nfts,
      pagination: {
        total,
        page,
        pageSize,
        totalPages
      }
    }
  } catch (error) {
    console.error('Error finding unverified NFTs by agentId:', error)
    throw error
  }
}


// 通过 id 查询 NFT 的验证状态
export async function getNFTVerificationStatus(id: string) {
  try {
    const nft = await prisma.nFT.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        networkId: true,
        collectionAddress: true,
        tokenId: true,
        verificationStatus: true,
        updatedAt: true
      }
    })

    if (!nft) {
      throw new Error(`NFT not found with id: ${id}`)
    }

    return nft
  } catch (error) {
    console.error('Error getting NFT verification status:', error)
    throw error
  }
}

// 更新单个 NFT 的验证状态
export async function updateNFTVerificationStatus(
        id: string,
        status: VerificationStatus
) {
  try {
    const updatedNFT = await prisma.nFT.update({
      where: {
        id: id
      },
      data: {
        verificationStatus: status
      },
      // 返回更新后的字段
      select: {
        id: true,
        networkId: true,
        collectionAddress: true,
        tokenId: true,
        verificationStatus: true,
        updatedAt: true
      }
    })

    return updatedNFT
  } catch (error) {
    console.error('Error updating NFT verification status:', error)
    throw error
  }
}


export async function getNFTDetail(id: string) {
  const nft = await prisma.nFT.findUnique({
    where: {
      id
    },
    include: {
      collection: {
        select: {
          authority: true,
          supply: true,
          mintPrice: true,
        }
      }
    }
  })
  return nft
}