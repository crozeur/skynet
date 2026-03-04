import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container(props: Readonly<ContainerProps>) {
  return (
    <div
      className={`w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto ${
        props.className ? props.className : ""
      }`}>
      {props.children}
    </div>
  );
}

