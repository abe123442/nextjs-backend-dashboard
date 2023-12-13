import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, value } = body
    if (!name || !value) {
      return new NextResponse("Name and Value are required", { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    // User does not have permission to modify a store they don't own
    if (!storeByUserId) {
      return new NextResponse("Unauthorised", { status: 403 })
    }

    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log("[SIZE_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// PUBLIC ROUTE
export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 })
    }

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    })

    return NextResponse.json(sizes)
  } catch (error) {
    console.log("[SIZES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
