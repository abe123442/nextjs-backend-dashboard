import prismadb from "../lib/prismadb"

export const getStoreAllDetails = async (storeId: string) => {
  console.log(storeId)
  console.log("here")
  return await prismadb.store.findUnique({
    where: {
      id: storeId
    },
    include: {
      orders: {
        include: {
          orderItems: {
            include: {
              product: true,
            }
          }
        }
      }
    }
  })
}

type StoreDetails = NonNullable<Awaited<ReturnType<typeof getStoreAllDetails>>>

export const getStoreRevenue = (store: StoreDetails) => {
  return store.orders.reduce(
    (total, currentOrder) => {
      let totalOrderCost = 0

      if (currentOrder.isPaid) {
        const itemPrices = currentOrder.orderItems.map(({ product }) => product.price)
        totalOrderCost = itemPrices.reduce((total, currentPrice) => total + currentPrice.toNumber(), 0)
      }

      return total + totalOrderCost
    },
    0
  )
}

export const getSalesCount = (store: StoreDetails) => {
  return store.orders.filter(({ isPaid }) => isPaid).length
}

export const getStockCount = async (storeId: string) => {
  return await prismadb.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  })
}

interface GraphData {
  name: string
  total: number
}

export const getGraphRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        }
      }
    }
  })

  const monthlyRevenue: { [key: number]: number } = {}

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth()
    let revenueForOrder = 0

    for (const item of order.orderItems) {
      revenueForOrder += item.product.price.toNumber()
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const graphData: GraphData[] = months.map(name => ({ name, total: 0 }))

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)]
  }

  return graphData
}
