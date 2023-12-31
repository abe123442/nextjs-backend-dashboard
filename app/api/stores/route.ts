import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name } = body
    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log("[STORES_POST]", error)
    switch (true) {
      case error instanceof PrismaClientKnownRequestError:
        if (error.code === "P2002") {
          return new NextResponse("A store with this name already exists.", {
            status: 400,
          })
        }
        break

      default:
        return new NextResponse("Internal Error", { status: 500 })
    }
  }
}
