import { PropsWithChildren } from "react";

type Props = {
  className?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
};

export default function CardBase({
  className,
  width = 380,
  height,
  onClick,
  children,
}: PropsWithChildren<Props>) {
  const style = {
    width,
    height,
  } as React.CSSProperties;
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
