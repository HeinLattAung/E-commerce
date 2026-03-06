import { formatPrice } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  comparePrice?: number;
}

export function PriceTag({ price, comparePrice }: PriceTagProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold">{formatPrice(price)}</span>
      {comparePrice && comparePrice > price && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(comparePrice)}
        </span>
      )}
    </div>
  );
}
