import React, { SelectHTMLAttributes, forwardRef } from "react";
import styles from "@/styles/components/_ui.module.scss";

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, options, error, fullWidth = true, className = "", ...rest },
    ref
  ) => {
    const selectClasses = [styles.select, error ? styles.error : "", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`${styles.formGroup} ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label className={styles.label} htmlFor={rest.id}>
            {label}
          </label>
        )}
        <select ref={ref} className={selectClasses} {...rest}>
          <option value="" disabled>
            Select an option
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
