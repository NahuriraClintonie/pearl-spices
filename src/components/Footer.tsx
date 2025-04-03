import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-700 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} Restaurant App. All rights reserved.
        </p>
        {/* Add additional footer content (social links, etc.) here */}
      </div>
    </footer>
  );
};

export default Footer;
