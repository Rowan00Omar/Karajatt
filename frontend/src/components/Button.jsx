import React from "react";

const Button = ({ children, onClick, className = "", ...props }) => {
  return (
    <button
      className={`bg-babyJanaBlue hover:bg-darkerJanaBlue text-white font-medium py-2 px-4 rounded ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
export default Button;
