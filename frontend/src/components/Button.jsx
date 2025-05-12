import React from "react";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`bg-babyJanaBlue hover:bg-darkerJanaBlue text-white font-medium py-2 px-4 rounded ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;
