import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, Heart, Settings } from "lucide-react"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = session.user

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <h1 className="font-serif text-3xl font-bold tracking-tight">My Profile</h1>
      <Separator className="my-6" />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Profile card */}
        <div className="rounded-lg border p-4 text-center sm:p-6">
          <Avatar className="mx-auto h-20 w-20 sm:h-24 sm:w-24">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="text-2xl">
              {user.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-lg font-medium">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.role === "ADMIN" && (
            <Badge className="mt-2">Admin</Badge>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-4 md:col-span-2">
          <Link
            href="/orders"
            className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 sm:p-5"
          >
            <Package className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">My Orders</p>
              <p className="text-sm text-muted-foreground">Track and manage your orders</p>
            </div>
          </Link>
          <Link
            href="/wishlist"
            className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 sm:p-5"
          >
            <Heart className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Wishlist</p>
              <p className="text-sm text-muted-foreground">Items you&apos;ve saved for later</p>
            </div>
          </Link>
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 sm:p-5"
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Admin Dashboard</p>
                <p className="text-sm text-muted-foreground">Manage products, orders, and users</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
