export function CartItem() {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="h-20 w-20 rounded-md bg-muted" />
      <div className="flex-1">
        <h3 className="font-medium">Product Name</h3>
        <p className="text-sm text-muted-foreground">$0.00</p>
      </div>
    </div>
  );
}
