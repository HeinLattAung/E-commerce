"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateOrderStatus } from "@/actions/admin.actions"
import { formatPrice, formatDate } from "@/lib/utils"
import { toast } from "sonner"
import type { Order, User } from "@prisma/client"

type OrderWithUser = Order & {
  user: Pick<User, "name" | "email" | "image">
}

const statuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  CONFIRMED: "secondary",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
}

interface Props {
  orders: OrderWithUser[]
}

export function OrdersClient({ orders }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.user.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user.email?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatusChange = (orderId: string, status: string) => {
    setUpdatingId(orderId)
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status)
      if (result.success) {
        toast.success(`Order status updated to ${status}`)
        router.refresh()
      }
      setUpdatingId(null)
    })
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Customer</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Date</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Payment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.items.length} item
                            {order.items.length !== 1 && "s"}
                          </p>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={order.user.image || ""} />
                            <AvatarFallback className="text-[10px]">
                              {order.user.name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm">{order.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatPrice(order.totalPrice)}
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        {order.isPaid ? (
                          <Badge variant="default" className="bg-emerald-600 text-xs">
                            Paid
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Unpaid
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {updatingId === order.id && isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Select
                              value={order.status}
                              onValueChange={(v) =>
                                handleStatusChange(order.id, v)
                              }
                            >
                              <SelectTrigger className="h-8 w-[140px]">
                                <Badge
                                  variant={statusVariant[order.status] ?? "outline"}
                                  className="text-xs"
                                >
                                  {order.status}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                {statuses.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
