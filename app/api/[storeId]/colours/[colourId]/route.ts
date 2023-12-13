import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function GET(
  _req: NextRequest,
  { params }: { params: { colourId: string } }
) {
  try {
    if (!params.colourId) {
      return new NextResponse("Colour ID is required", {
        status: 400,
      })
    }

    const colour = await prismadb.colour.findUnique({
      where: {
        id: params.colourId,
      },
    })

    return NextResponse.json(colour)
  } catch (error) {
    console.log("[COLOUR_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { storeId: string; colourId: string } }
) {
  try {
    // initial error checking with authentication and request body
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.colourId || !params.storeId) {
      return new NextResponse("Colour and store IDs are required", {
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

    const colour = await prismadb.colour.update({
      where: {
        id: params.colourId,
      },
      data: {
        name,
        value,
      },
    })

    return NextResponse.json(colour)
  } catch (error) {
    console.log("[COLOUR_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { storeId: string; colourId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.colourId || !params.storeId) {
      return new NextResponse("Colour and store IDs are required", {
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

    const colour = await prismadb.colour.delete({
      where: {
        id: params.colourId,
      },
    })

    return NextResponse.json(colour)
  } catch (error) {
    console.log("[COLOUR_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
