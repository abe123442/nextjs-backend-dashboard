import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name } = body;
    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId
      }
    });
    return NextResponse.json(store);
  } catch (error) {
    switch (true) {
      case error instanceof PrismaClientKnownRequestError:
        if (error.code === 'P2002') {
          return new NextResponse(JSON.stringify('A store with this name already exists.'), { status: 400 });
        }
        break;

      default:
        return new NextResponse(JSON.stringify('Something went wrong.'), { status: 500 });
    }
  }
}