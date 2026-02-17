import { PropsWithChildren } from "react";

type Props = {
  className?: string;
  width?: number;
  height?: number;
};

export default function CardBase({
  className,
  width = 380,
  height,
  children,
}: PropsWithChildren<Props>) {
  const style = {
    width,
    height,
  } as React.CSSProperties;
  return (
    <div className={`card-base${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </div>
  );
}
