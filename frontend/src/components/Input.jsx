import React from "react";

const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full p-2 border-babyJanaBlue border rounded focus:outline-none focus:ring-1 focus:ring-babyJanaBlue ${className}`}
      {...props}
    />
  );
};

export default Input;
