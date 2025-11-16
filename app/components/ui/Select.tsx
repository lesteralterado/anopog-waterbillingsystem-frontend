import { forwardRef, SelectHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: boolean;
}

/**
 * Native HTML select with basic styling. Keep this as the primary controlled
 * select element for forms. We also export a few presentational helpers
 * (SelectTrigger, SelectValue, SelectContent, SelectItem) below so callers
 * can progressively enhance the UI without introducing new dependencies.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, children, ...props }, ref) => {
    return (
      <select
        className={`
          flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm
          ring-offset-background focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed
          disabled:opacity-50
          ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}
          ${className || ''}
        `}
        ref={ref}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';

/*
  Presentational helper components

  These are lightweight, dependency-free building blocks you can combine with
  the native `Select` or with a custom popover/list implementation later.
*/

export interface SelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** id of the native select to forward focus to when the trigger is clicked */
  selectId?: string;
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(({ selectId, className, children, ...props }, ref) => {
  const handleClick = (e: any) => {
    if (selectId) {
      const el = document.getElementById(selectId) as HTMLSelectElement | null;
      if (el) el.focus();
    }
    if (props.onClick) props.onClick(e);
  };

  return (
    <button
      type="button"
      ref={ref}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm bg-white ${className || ''}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

export interface SelectValueProps extends HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(({ placeholder = 'Select...', className, children, ...props }, ref) => {
  return (
    <span ref={ref} className={`text-sm text-foreground ${className || ''}`} {...props}>
      {children ?? placeholder}
    </span>
  );
});
SelectValue.displayName = 'SelectValue';

export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
  position?: 'bottom' | 'top';
}

const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(({ className, children, position = 'bottom', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`bg-white rounded-md shadow-md ring-1 ring-black/5 p-1 ${position === 'top' ? 'origin-bottom' : 'origin-top'} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
});
SelectContent.displayName = 'SelectContent';

export interface SelectItemProps extends HTMLAttributes<HTMLElement> {
  value?: string;
  /** Render as an <option> element when true (useful for forms) */
  asOption?: boolean;
}

/**
 * SelectItem can render as an <option> (for use inside a native <select>)
 * or as an interactive element (div) to be used inside `SelectContent`.
 */
const SelectItem = forwardRef<HTMLElement, SelectItemProps>(({ value, asOption = true, className, children, ...props }, ref) => {
  if (asOption) {
    // Render a native option — cast ref to any to satisfy TS on option refs
    return (
      // eslint-disable-next-line jsx-a11y/no-redundant-roles
      <option ref={ref as any} value={value} className={className} {...(props as any)}>
        {children}
      </option>
    );
  }

  return (
    <div
      role="option"
      ref={ref as any}
      className={`px-2 py-1 rounded hover:bg-gray-100 cursor-pointer ${className || ''}`}
      data-value={value}
      {...props}
    >
      {children}
    </div>
  );
});
SelectItem.displayName = 'SelectItem';

export { SelectTrigger, SelectValue, SelectContent, SelectItem };
export { Select };
export default Select;