import { forwardRef } from "react";

const Button = forwardRef(function Button(
  { variant = "primary", loading = false, className = "", children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`button button--${variant} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="spinner" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
});

export default Button;
