import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function CartSummary() {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>
      <Separator className="my-4" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>Free</span>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>$0.00</span>
      </div>
      <Button className="mt-6 w-full" size="lg">Proceed to Checkout</Button>
    </div>
  );
}
