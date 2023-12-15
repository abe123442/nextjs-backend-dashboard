import { headers } from "next/headers"
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const getAddressString = (stripeAddress: Stripe.Address | null | undefined) => {
  const components = Object.values({ ...stripeAddress }).filter((c) => typeof c === "string")
  return components.join(", ")
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    return new NextResponse(`Webhook Error: ${(error as Error).message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const address = getAddressString(session.customer_details?.address)

  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      where: {
        id: session.metadata?.orderId
      },
      data: {
        isPaid: true,
        address,
        phone: session.customer_details?.phone || ""
      },
      include: {
        orderItems: true,
      }
    })

    const productIds = order.orderItems.map(({ productId }) => productId)
    await prismadb.product.updateMany({
      where: {
        id: {
          in: productIds,
        },
      },
      data: {
        isArchived: true,
      },
    })
  }

  return new NextResponse(null, { status: 200 })
}