import { format } from "date-fns"

import prismadb from "@/lib/prismadb"

import { ColoursClient } from "./components/client"
import { ColourColumn } from "./components/columns"

const ColoursPage = async ({ params }: { params: { storeId: string } }) => {
  const colours = await prismadb.colour.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formattedColours: ColourColumn[] = colours.map((colour) => ({
    id: colour.id,
    name: colour.name,
    value: colour.value,
    createdAt: format(colour.createdAt, "MMMM do, yyyy"),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColoursClient data={formattedColours} />
      </div>
    </div>
  )
}

export default ColoursPage
