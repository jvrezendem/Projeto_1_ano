import { forwardRef } from "react";
import { Button as ShadcnButton } from "@/components/ui/button";

const Button = forwardRef(function Button(
  { variant = "primary", loading = false, className = "", children, disabled, ...props },
  ref,
) {
  return (
    <ShadcnButton
      ref={ref}
      variant={variant === "primary" ? "default" : variant}
      size="lg"
      className={`button button--${variant} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="spinner" data-icon="inline-start" aria-hidden="true" /> : null}
      <span>{children}</span>
    </ShadcnButton>
  );
});

export default Button;
