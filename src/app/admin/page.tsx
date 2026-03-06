import Link from "next/link"
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDashboardStats } from "@/actions/admin.actions"
import { formatPrice, formatDate } from "@/lib/utils"

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const cards = [
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: stats.totalProducts.toString(),
      icon: Package,
    },
    {
      title: "Customers",
      value: stats.totalUsers.toString(),
      icon: Users,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance.</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link
            href="/admin/orders"
            className="text-sm text-muted-foreground hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{order.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.orderNumber} &middot;{" "}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={order.isPaid ? "default" : "outline"}
                      className={order.isPaid ? "bg-emerald-600" : ""}
                    >
                      {order.isPaid ? "Paid" : order.status}
                    </Badge>
                    <span className="text-sm font-medium">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
