import React from "react";

export const generateJSX = (n: number, jsx: React.ReactElement) => {
    return Array.from({ length: n }, (_, index) => {
      return React.cloneElement(jsx, { key: index });
    });
  };