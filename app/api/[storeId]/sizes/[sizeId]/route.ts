import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function GET(
  _req: NextRequest,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size ID is required", {
        status: 400,
      })
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log("[SIZE_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    // initial error checking with authentication and request body
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.sizeId || !params.storeId) {
      return new NextResponse("Size and store IDs are required", {
        status: 400,
      })
    }

    const body = await req.json()
    const { name, value } = body

    if (!name || !value) {
      return new NextResponse("Name and Value are required", { status: 400 })
    }

    // validate accessing of data provided by request body
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    // User does not have permission to modify a store and/or billboard they don't own
    if (!storeByUserId) {
      return new NextResponse("Unauthorised", { status: 403 })
    }

    const size = await prismadb.size.update({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log("[SIZE_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.sizeId || !params.storeId) {
      return new NextResponse("Size and store IDs are required", {
        status: 400,
      })
    }

    // validate accessing of data provided by request body
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    // User does not have permission to modify a store and/or billboard they don't own
    if (!storeByUserId) {
      return new NextResponse("Unauthorised", { status: 403 })
    }

    const size = await prismadb.size.delete({
      where: {
        id: params.sizeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log("[SIZE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
