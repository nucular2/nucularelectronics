import { PropsWithChildren } from "react";

type Props = {
  className?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
};

export default function CardBase({
  className,
  width,
  height,
  onClick,
  children,
}: PropsWithChildren<Props>) {
  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;

  return (
    <div
      className={`card-base${className ? ` ${className}` : ""}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
