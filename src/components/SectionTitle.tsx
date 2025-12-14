import React from "react";
import { Container } from "@/components/Container";

interface SectionTitleProps {
  preTitle?: string;
  title?: string;
  align?: "left" | "center";
  children?: React.ReactNode;
}

export const SectionTitle = (props: Readonly<SectionTitleProps>) => {
  return (
    <Container
      className={`flex w-full flex-col mt-6 mb-16 ${
        props.align === "left" ? "" : "items-center justify-center text-center"
      }`}>
      {props.preTitle && (
        <div className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-4">
          {props.preTitle}
        </div>
      )}

      {props.title && (
        <h2 className="max-w-3xl text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-gray-800 lg:leading-tight dark:text-white mb-6">
          {props.title}
        </h2>
      )}

      {props.children && (
        <p className="max-w-2xl text-lg lg:text-xl leading-relaxed text-gray-600 lg:text-gray-600 dark:text-gray-300">
          {props.children}
        </p>
      )}
    </Container>
  );
}

