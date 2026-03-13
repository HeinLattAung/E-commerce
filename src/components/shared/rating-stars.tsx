import { Star, StarHalf } from "lucide-react"

interface RatingStarsProps {
  rating: number
  count?: number
  size?: "sm" | "md"
}

export function RatingStars({ rating, count, size = "sm" }: RatingStarsProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.5

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < fullStars) {
          return (
            <Star
              key={i}
              className={`${iconSize} fill-amber-400 text-amber-400`}
            />
          )
        }
        if (i === fullStars && hasHalf) {
          return (
            <StarHalf
              key={i}
              className={`${iconSize} fill-amber-400 text-amber-400`}
            />
          )
        }
        return (
          <Star
            key={i}
            className={`${iconSize} text-muted-foreground/30`}
          />
        )
      })}
      {count !== undefined && (
        <span className="ml-1.5 text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  )
}
