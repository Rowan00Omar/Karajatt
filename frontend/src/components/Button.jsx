import React from "react";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`bg-babyJanaBlue/80 hover:bg-babyJanaBlue text-white font-medium py-2 px-4 rounded ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;
