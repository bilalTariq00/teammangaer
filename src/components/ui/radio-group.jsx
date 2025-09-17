"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Simple RadioGroup implementation without external dependencies
const RadioGroupContext = React.createContext({
  value: "",
  onValueChange: () => {},
});

const RadioGroup = React.forwardRef(({ className, value, onValueChange, ...props }, ref) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div
        ref={ref}
        className={cn("grid gap-2", className)}
        {...props}
      />
    </RadioGroupContext.Provider>
  );
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef(({ className, value, id, ...props }, ref) => {
  const { value: selectedValue, onValueChange } = React.useContext(RadioGroupContext);
  const isSelected = selectedValue === value;

  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={() => onValueChange(value)}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center",
        isSelected && "bg-primary text-primary-foreground",
        className
      )}
      {...props}
    >
      {isSelected && (
        <div className="h-2.5 w-2.5 rounded-full bg-current" />
      )}
    </button>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
