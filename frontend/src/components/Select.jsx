"use client";
import React from "react";
export function Select({
  value,
  onValueChange,
  children,
  className = "",
  ...props
}) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`w-full p-2 border rounded ${className}`}
    >
      {children}
    </select>
  );
}
export function SelectItem({ children, value, disabled }) {
  return (
    <option value={value} disabled={disabled}>
      {children}
    </option>
  );
}
