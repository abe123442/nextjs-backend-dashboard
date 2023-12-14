import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function GET(
  _req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category ID is required.", {
        status: 400,
      })
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORY_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    // initial error checking with authentication and request body
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.categoryId) {
      return new NextResponse("Category ID is required.", {
        status: 400,
      })
    }

    const body = await req.json()
    const { name, billboardId } = body

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 })
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

    const category = await prismadb.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.categoryId || !params.storeId) {
      return new NextResponse("Category and store IDs are required", {
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

    const category = await prismadb.category.delete({
      where: {
        id: params.categoryId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
