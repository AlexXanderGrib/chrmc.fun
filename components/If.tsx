import { PropsWithChildren } from "react";

type IfProps = PropsWithChildren<{
  condition: boolean;
}>

export function If({ condition, children }: IfProps) {
  if(!condition) return null;

  return <>{children}</>
}