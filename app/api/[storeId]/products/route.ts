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

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 })
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

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colourId,
        sizeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        },
        isFeatured,
        isArchived,
        storeId: params.storeId,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCT_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// PUBLIC ROUTE
export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId") || undefined
    const colourId = searchParams.get("colourId") || undefined
    const sizeId = searchParams.get("sizeId") || undefined
    const isFeatured = searchParams.get("isFeatured")

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 })
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colourId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        colour: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc"
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.log("[PRODUCTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
