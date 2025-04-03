import React from "react";
import { countryMapping } from "./countries"; //  country code mapping (e.g., 'us' -> 'United States').

/**
 * RestaurantCard Component
 *
 * Renders a card displaying information about a single restaurant, including its image, name,
 * rating (as stars), and associated countries.  Designed to be used in a list of restaurants.
 *
 * @component
 * @param {object} props - The component props.
 * @param {Restaurant} props.restaurant - The restaurant data object.
 * @returns {JSX.Element} The rendered RestaurantCard component.
 */
interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const totalStars = 5; // Define the maximum number of stars for the rating.
  const rating = Number(restaurant.restaurant_rating || 0); // Convert rating to a number, defaulting to 0.

  // Create an array of booleans representing filled/empty stars based on the rating.
  const stars = Array.from(
    { length: totalStars },
    (_, index) => index < rating,
  );

  // Ensure `countries` is always an array, even if `restaurant.restaurant_countries` is a single string.
  const countries = Array.isArray(restaurant.restaurant_countries)
    ? restaurant.restaurant_countries
    : [restaurant.restaurant_countries];

  // Map country codes (e.g., 'us', 'ca') to full country names (e.g., 'United States', 'Canada')

  const fullCountryNames = countries.map(
    (country) => countryMapping[country] || country,
  );

  // Determine the image URL.  Assumes `restaurant.restaurant_image` is an object with a `guid` property.

  const imageUrl = restaurant.restaurant_image.guid;

  return (
    <a
      href={restaurant.permalink} // Make the entire card a link to the singlerestaurant's detail page
      className="w-64 h-96 bg-white border border-gray-300 rounded-lg overflow-hidden flex flex-col"
    >
      {/* Image Section */}
      <div className="h-3/5 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={restaurant.restaurant_name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Restaurant Name */}
      <div className="text-xl font-semibold p-4">
        {restaurant.restaurant_name}
      </div>

      {/* Star Rating */}
      <div className="flex mb-2 ml-4">
        {/* Render stars based on the `stars` array */}
        {stars.map((isFilled, index) => (
          <span
            key={index}
            className={
              isFilled ? "text-yellow-500 text-2xl" : "text-gray-300 text-2xl"
            }
          >
            ★ {/* The star character */}
          </span>
        ))}
      </div>

      {/* Country Names */}
      <div className="flex justify-between p-2">
        <div className="text-sm text-gray-600">
          {/* Join the full country names with a separator. */}
          {fullCountryNames.join(" | ")}
        </div>
      </div>
    </a>
  );
};

export default RestaurantCard;
