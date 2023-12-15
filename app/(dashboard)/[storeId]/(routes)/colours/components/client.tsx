"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { ColourColumn, columns } from "./columns"

interface ColoursClientProps {
  data: ColourColumn[]
}

export const ColoursClient: React.FC<ColoursClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colours (${data.length})`}
          description="Manage colours for this store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/colours/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} filterKey="name" />
      <Heading title="API" description="API calls for colours" />
      <Separator />

      <ApiList entityName="colours" entityIdName="colourId" />
    </>
  )
}
