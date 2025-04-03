import React from "react";
import StarRating from "../components/starRating";
import MenuItems from "../components/MenuItems";
import Layout from "../components/Layout";

/**
 * SingleRestaurantView Component
 *
 * Displays the details of a single restaurant, including its name, image, rating,
 * countries, and menu items.  Retrieves restaurant data from the global `window.WPData` object.
 *
 * @component
 * @returns {JSX.Element} The rendered SingleRestaurantView component.
 */
const SingleRestaurantView: React.FC = () => {
  // Retrieve data from the global window object (or use an empty object fallback).

  const data = window.WPData || {};

  // Extract the restaurant data from the global data object.
  const restaurant = data.pageData?.restaurant;

  // Ensure that we have an array of menus; otherwise fall back to an empty array.

  const menus = Array.isArray(restaurant?.menus) ? restaurant.menus : [];

  if (!restaurant) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto p-4 text-center">
          <p className="text-red-500 text-lg">No restaurant data found.</p>
        </div>
      </Layout>
    );
  }

  /**
   * Determine the image source:
   */
  const imageSource =
    typeof restaurant.restaurant_image === "string"
      ? restaurant.restaurant_image
      : restaurant.restaurant_image?.guid;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
        {/* Display the restaurant's name in a large heading */}
        <h1 className="text-4xl font-bold mb-4 text-center">
          {restaurant.restaurant_name}
        </h1>

        {/* Display the restaurant's image if `imageSource` is truthy */}
        {imageSource && (
          <div className="mb-6 flex justify-center">
            <img
              src={imageSource}
              alt={restaurant.restaurant_name}
              className="w-full max-w-2xl h-60 object-cover rounded"
            />
          </div>
        )}

        {/* Restaurant Rating and Countries */}
        <div className="text-lg mb-6 space-y-2">
          {/* Display the restaurant's rating using the StarRating component */}
          <StarRating rating={Number(restaurant.restaurant_rating) || 0} />

          {/* Display the countries associated with the restaurant */}
          <p>
            <span className="font-semibold">Countries:</span>{" "}
            {/* Handle cases where restaurant_countries could be a string or array. */}
            {Array.isArray(restaurant.restaurant_countries)
              ? restaurant.restaurant_countries.join(", ") // Join array elements with commas
              : restaurant.restaurant_countries}
          </p>
        </div>

        {/* Menu Items Section */}
        {menus.length > 0 ? (
          // If there are menu items, display them
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">Our Menu</h2>
            {/* Grid layout for menu items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Map through the menus array and render a MenuItems component for each */}
              {menus.map((menu) => (
                <MenuItems key={menu.ID} menu={menu} />
              ))}
            </div>
          </div>
        ) : (
          // If there are no menu items, display a "No menu items" message
          <p className="text-gray-500 italic mt-2">No menu items available.</p>
        )}
      </div>
    </Layout>
  );
};

export default SingleRestaurantView;
