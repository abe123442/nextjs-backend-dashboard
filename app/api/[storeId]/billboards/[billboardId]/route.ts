import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function GET(
  _req: NextRequest,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    if (!params.billboardId || !params.storeId) {
      return new NextResponse("Billboard and store IDs are required", {
        status: 400,
      })
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARD_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    // initial error checking with authentication and request body
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.billboardId || !params.storeId) {
      return new NextResponse("Billboard and store IDs are required", {
        status: 400,
      })
    }

    const body = await req.json()
    const { label, imageUrl } = body

    if (!label || !imageUrl) {
      return new NextResponse("Label and Image URL are required", { status: 400 })
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

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.billboardId || !params.storeId) {
      return new NextResponse("Billboard and store IDs are required", {
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

    const billboard = await prismadb.billboard.delete({
      where: {
        id: params.billboardId,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
