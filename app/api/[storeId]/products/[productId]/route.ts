import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function GET(
  _req: NextRequest,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    if (!params.productId || !params.storeId) {
      return new NextResponse("Product and store IDs are required", {
        status: 400,
      })
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        colour: true,
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCT_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    // initial error checking with authentication and request body
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.productId || !params.storeId) {
      return new NextResponse("Product and store IDs are required", {
        status: 400,
      })
    }

    const body = await req.json()
    const {
      name,
      price,
      categoryId,
      colourId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 })
    }

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 })
    }

    if (!colourId) {
      return new NextResponse("Colour ID is required", { status: 400 })
    }

    if (!sizeId) {
      return new NextResponse("Size ID is required", { status: 400 })
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 })
    }

    // validate accessing of data provided by request body
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    // User does not have permission to modify a store and/or product they don't own
    if (!storeByUserId) {
      return new NextResponse("Unauthorised", { status: 403 })
    }

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colourId,
        sizeId,
        images: {
          deleteMany: {}
        },
        isFeatured,
        isArchived,
      },
    })

    const product = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)]
          }
        }
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.productId || !params.storeId) {
      return new NextResponse("Product and store IDs are required", {
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

    // User does not have permission to modify a store and/or product they don't own
    if (!storeByUserId) {
      return new NextResponse("Unauthorised", { status: 403 })
    }

    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
