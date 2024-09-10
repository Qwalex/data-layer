import { prisma } from '@shared/lib'
import { NextRequest } from 'next/server'

export const GET = async (request: NextRequest) => {
  const isShort = request.nextUrl.searchParams.get('short') === '1'
  const id = request.nextUrl.searchParams.get('id')
  let result = null
  const select = {
    id: true,
    name: true,
    task: true,
    createdAt: true,
    updatedAt: true,
    ...(!isShort && {
      columns: true,
      dataSource: true
    })
  }

  if (id) {
    result = await prisma.dataLayers.findFirst({
      where: { id: Number(id) },
      select,
    })
  } else {
    result = await prisma.dataLayers.findMany({
      select,
    })
  }
  
  return Response.json(result)
}
