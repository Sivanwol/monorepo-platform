import type { CheckboxProps } from "@mui/material/Checkbox";
import type { HTMLProps } from "react";
import { useEffect, useRef, useState } from "react";
import Checkbox from "@mui/material/Checkbox";

export function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: {
  indeterminate: boolean;
  className?: string;
  [key: string]: any;
}) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest]);

  return (
    <input
      type="checkbox"
      ref={ref}
      checked={rest.checked}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}
