import React from "react";
import MenuDetails from "./MenuDetails";

/**
 * MenuItem Component
 *
 * Renders a single menu item with its image, name, price, and details.
 *
 * @component
 * @param {object} props - The component props.
 * @param {object} props.menu - The menu item data.
 * @param {string} [props.menu.menu_image.guid] - The URL of the menu item's image.
 * @param {string} props.menu.menu_name - The name of the menu item.
 * @param {number} [props.menu.menu_price] - The price of the menu item.
 * @param {Array<any>} [props.menu.menu_details] -  An array of details about the menu item.  Handles cases where menu_details might not be an array.
 * @returns {JSX.Element} The rendered MenuItem component.
 */
const MenuItem: React.FC<{ menu: any }> = ({ menu }) => {
  // Ensure detailsArray is always an array, even if menu.menu_details is undefined or not an array.
  const detailsArray = Array.isArray(menu.menu_details)
    ? menu.menu_details
    : [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Conditionally render the image if menu_image.guid exists */}
      {menu.menu_image?.guid && (
        <img
          src={menu.menu_image.guid}
          alt={menu.menu_name}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4">
        {/* Menu Item Title and Price Container */}
        <div className="flex justify-between items-start mb-2">
          {/* Menu Item Name */}
          <h3 className="text-xl font-semibold">{menu.menu_name}</h3>

          {/* Conditionally render the price if menu_price exists */}
          {menu.menu_price && (
            <span className="text-lg font-medium text-green-600">
              {/* Display price formatted to two decimal places */}$
              {menu.menu_price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Render Menu Details */}
        <MenuDetails details={detailsArray} />
      </div>
    </div>
  );
};

export default MenuItem;
