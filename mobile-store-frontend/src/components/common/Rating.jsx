import React from "react";
import { Star, User } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "../../utils/format";

export const Rating = ({ value = 0, count = 0, size = "md", interactive = false, onChange = null }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={interactive ? { scale: 1.1 } : {}}
            onClick={() => interactive && onChange?.(star)}
            className={`${interactive ? "cursor-pointer" : "cursor-default"}`}
            disabled={!interactive}
          >
            <Star
              className={`${sizes[size]} ${
                star <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-300 dark:text-slate-600"
              } transition-colors`}
            />
          </motion.button>
        ))}
      </div>
      {count > 0 && (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          ({count})
        </span>
      )}
    </div>
  );
};

export const ReviewCard = ({ review }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="border-b border-slate-200 dark:border-slate-700 py-4 last:border-b-0"
  >
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold text-slate-900 dark:text-slate-50">
            {review.name}
          </h4>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatDate(review.createdAt)}
          </span>
        </div>
        <div className="mt-1">
          <Rating value={review.rating} size="sm" />
        </div>
        {review.comment && (
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
            {review.comment}
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

export const ReviewList = ({ reviews = [], loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
        Failed to load reviews
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 dark:text-slate-400">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, idx) => (
        <ReviewCard key={idx} review={review} />
      ))}
    </div>
  );
};
