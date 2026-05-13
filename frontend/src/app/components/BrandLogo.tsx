import React from "react";
import logoSrc from "../../../ClearStack.png";

type BrandLogoProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function BrandLogo({ className, style }: BrandLogoProps) {
  return (
    <img
      src={logoSrc}
      alt="ClearStack"
      className={className}
      style={style}
    />
  );
}