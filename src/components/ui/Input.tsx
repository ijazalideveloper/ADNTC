import React, { InputHTMLAttributes, forwardRef } from "react";
import styles from "@/styles/components/_ui.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, icon, className = "", ...rest }, ref) => {
    const inputClasses = [styles.input, error ? styles.error : "", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`${styles.formGroup} ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label className={styles.label} htmlFor={rest.id}>
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            style={icon ? { paddingLeft: "2.5rem" } : {}}
            {...rest}
          />
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
