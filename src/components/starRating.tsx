import React from "react";

/**
 * StarRating Component
 *
 * Renders a star rating display, showing a number of filled stars based on the given rating.
 *
 * @component
 * @param {object} props - The component props.
 * @param {number} props.rating - The rating value (number of filled stars).
 * @param {number} [props.totalStars=5] - The total number of stars to display (default is 5).
 * @returns {JSX.Element} The rendered StarRating component.
 *
 * @example
 * // Renders 3 filled stars and 2 empty stars.
 * <StarRating rating={3} />
 *

 */
const StarRating: React.FC<{
  rating: number;
  totalStars?: number;
}> = ({ rating, totalStars = 5 }) => {
  return (
    <div className="flex justify-center">
      {/* Create an array with a length equal to totalStars and map over it */}
      {Array.from({ length: totalStars }, (_, index) => (
        <span
          key={index} // Use the index as the key for each star
          className={
            // Conditional styling:
            // If the index is less than the rating, use the filled star class (yellow).
            // Otherwise, use the empty star class (gray).
            index < rating
              ? "text-yellow-500 text-2xl" // Filled star (yellow)
              : "text-gray-300 text-2xl" // Empty star (gray)
          }
        >
          ★ {/* Render the star character */}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
