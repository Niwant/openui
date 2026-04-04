import React, { useState } from "react";

export interface ScatterDotProps {
  cx?: number;
  cy?: number;
  fill?: string;
  radius?: number;
  size?: number;
  variant?: "circle" | "square" | "bubble";
}

function getDotRadius(size?: number, radius?: number) {
  if (typeof radius === "number" && radius > 0) {
    return radius;
  }

  if (typeof size === "number" && size > 0) {
    return Math.max(4, Math.sqrt(size / Math.PI));
  }

  return 3;
}

const ScatterDot: React.FC<ScatterDotProps> = ({
  cx,
  cy,
  fill,
  radius,
  size,
  variant = "circle",
}) => {
  const [active, setActive] = useState(false);
  if (typeof cx !== "number" || typeof cy !== "number") {
    return null;
  }

  const OUTLINE_COLOR = "var(--openui-highlight)";
  const OUTLINE_WIDTH = 2;
  const baseRadius = getDotRadius(size, radius);
  const displayRadius = active ? baseRadius + 2 : baseRadius;

  if (variant === "bubble") {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={displayRadius}
        fill={fill}
        fillOpacity={active ? 0.95 : 0.7}
        stroke={active ? OUTLINE_COLOR : fill}
        strokeOpacity={active ? 1 : 0.55}
        strokeWidth={active ? OUTLINE_WIDTH : 1.5}
        vectorEffect="non-scaling-stroke"
        onPointerEnter={() => {
          setActive(true);
        }}
        onPointerLeave={() => {
          setActive(false);
        }}
      />
    );
  }

  if (variant === "square") {
    const sideLength = displayRadius * 2;
    return (
      <rect
        x={cx - displayRadius}
        y={cy - displayRadius}
        width={sideLength}
        height={sideLength}
        fill={fill}
        stroke={active ? OUTLINE_COLOR : "none"}
        strokeWidth={OUTLINE_WIDTH}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        rx={2}
        onPointerEnter={() => {
          setActive(true);
        }}
        onPointerLeave={() => {
          setActive(false);
        }}
      />
    );
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={displayRadius}
      fill={fill}
      stroke={active ? OUTLINE_COLOR : "none"}
      strokeWidth={OUTLINE_WIDTH}
      vectorEffect="non-scaling-stroke"
      onPointerEnter={() => {
        setActive(true);
      }}
      onPointerLeave={() => {
        setActive(false);
      }}
    />
  );
};

export default ScatterDot;
