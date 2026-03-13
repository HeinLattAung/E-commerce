import { getAdminOrders } from "@/actions/admin.actions"
import { OrdersClient } from "@/components/admin/orders-client"

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track customer orders ({orders.length} total).
        </p>
      </div>
      <OrdersClient orders={orders} />
    </div>
  )
}
