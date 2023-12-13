"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { Copy, CopyPlus, Edit, MoreHorizontal, Trash } from "lucide-react"

import { AlertModal } from "@/components/modals/alert-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { SizeColumn } from "./columns"
import { SizeFormValues } from "../[sizeId]/components/size-form"

interface CellActionProps {
  data: SizeColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success("Size ID copied to clipboard.")
  }

  const onDuplicate = async () => {
    const res = await axios.get(`/api/${params.storeId}/sizes/${data.id}`)
    const values = res.data as SizeFormValues
    await axios.post(`/api/${params.storeId}/sizes`, values)
    router.refresh()
    toast.success("Size duplicated.")
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/sizes/${data.id}`)
      router.push(`/${params.storeId}/sizes`)
      router.refresh()
      toast.success("Size deleted.")
    } catch (error) {
      toast.error("Make sure you first remove all products using this Size.")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onDuplicate()}>
            <CopyPlus className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
