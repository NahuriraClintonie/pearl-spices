import React from "react";
import RestaurantCard from "../components/RestaurantCard";
import Layout from "../components/Layout";

/**
 * View Component (Restaurant Listing)
 *
 * Displays a list of restaurants, retrieved from the global `window.WPData` object.
 * Renders each restaurant using the `RestaurantCard` component.
 *
 * @component
 * @returns {JSX.Element} The rendered View component.
 */
const View: React.FC = () => {
  // Retrieve data from the global `window.WPData` object, defaulting to an empty object if not found.
  // `window.WPData` is assumed to be populated by an external script (e.g., WordPress's `wp_localize_script`).
  const data = window.WPData || {};
  console.log("WPData from the listing page:", data); // Log the retrieved data for debugging.

  // Extract the restaurants array from `data.pageData`, defaulting to an empty array if not found.
  // Type assertion: We're telling TypeScript that `restaurants` should be an array of `Restaurant` objects.
  // The `Restaurant` type needs to be defined elsewhere in your project (e.g., in a `types.ts` or `interfaces.ts` file).
  const restaurants: Restaurant[] = data.pageData?.restaurants || [];

  // If no restaurants are found, display a "No restaurants found" message.
  if (!restaurants.length) {
    return (
      <Layout>
        <p className="text-red-400 text-center mt-6">No restaurants found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-gray-200 shadow-lg rounded-lg min-h-screen overflow-y-auto">
        <div className="mt-6">
          {/* Grid layout for displaying restaurant cards */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Map over the restaurants array and render a RestaurantCard for each */}
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default View;
