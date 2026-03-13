import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { RatingStars } from "@/components/shared/rating-stars"
import { formatDate } from "@/lib/utils"
import type { Review, User } from "@prisma/client"

interface ProductReviewsProps {
  reviews: (Review & { user: Pick<User, "name" | "image"> })[]
  rating: number
  numReviews: number
}

export function ProductReviews({ reviews, rating, numReviews }: ProductReviewsProps) {
  if (numReviews === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No reviews yet. Be the first to share your experience.
        </p>
      </div>
    )
  }

  // Rating breakdown
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: Math.round((reviews.filter((r) => r.rating === star).length / numReviews) * 100),
  }))

  return (
    <div>
      {/* Summary */}
      <div className="flex flex-col items-center gap-8 sm:flex-row">
        <div className="text-center">
          <p className="text-5xl font-light">{rating.toFixed(1)}</p>
          <RatingStars rating={rating} />
          <p className="mt-1 text-sm text-muted-foreground">
            {numReviews} {numReviews === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="flex-1 space-y-2">
          {breakdown.map((b) => (
            <div key={b.star} className="flex items-center gap-3 text-sm">
              <span className="w-6 text-right text-muted-foreground">{b.star}</span>
              <div className="h-2 flex-1 overflow-hidden bg-muted">
                <div
                  className="h-full bg-foreground transition-all"
                  style={{ width: `${b.pct}%` }}
                />
              </div>
              <span className="w-8 text-xs text-muted-foreground">{b.count}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Individual reviews */}
      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id}>
            <div className="flex items-start gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={review.user.image || undefined} />
                <AvatarFallback className="text-xs">
                  {review.user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{review.user.name}</p>
                  <time className="text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </time>
                </div>
                <RatingStars rating={review.rating} />
                <p className="mt-2 text-sm font-medium">{review.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
