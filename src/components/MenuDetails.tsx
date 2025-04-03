/**
 * MenuDetails Component
 *
 * This component receives an array of menu detail objects and displays each object's
 * information, including price, description, ingredients, and preparation time.
 * If there are no details provided, it displays a fallback message.
 */

import React from "react";

const MenuDetails: React.FC<{ details: any[] }> = ({ details }) => {
  return (
    <>
      {details.length > 0 ? (
        details.map((detail, index) => (
          <div key={index} className="mt-4 p-3 border-t border-gray-200">
            {detail.menu_price !== undefined && (
              <div className="mb-1 text-green-700 font-semibold">
                Sub-price: ${detail.menu_price.toFixed(2)}
              </div>
            )}
            {detail.menu_description && (
              <p className="text-gray-600">{detail.menu_description}</p>
            )}
            {detail.menu_ingredients?.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Ingredients:
                </h4>
                <p className="text-sm text-gray-500">
                  {detail.menu_ingredients.join(", ")}
                </p>
              </div>
            )}
            {detail.prep_time > 0 && (
              <div className="mt-1 text-sm text-gray-500">
                Prep Time: {detail.prep_time} minutes
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic mt-2">
          No additional details for this menu item.
        </p>
      )}
    </>
  );
};

export default MenuDetails;
