import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold">
          Restaurant App
        </a>
        {/* Add navigation links here if needed, e.g.,
        <nav>
          <a href="/" className="ml-4 hover:text-white">
            Home
          </a>
          <a href="/about" className="ml-4 hover:text-gray-300">
            About
          </a>
        </nav> */}
      </div>
    </header>
  );
};

export default Header;
