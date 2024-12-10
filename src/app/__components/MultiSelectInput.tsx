/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React, { useContext, useState } from "react";
import { createContext } from "react";

const MultiSelectContext = createContext({
  isOpen: false,
  setIsOpen: (value: boolean) => {},
});

export const MultiSelect: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const contextValue = { isOpen, setIsOpen };

  return (
    <MultiSelectContext.Provider value={contextValue}>
      <div {...props}>{children}</div>
    </MultiSelectContext.Provider>
  );
};

const useMultiSelectContext = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error(
      "useMultiSelect must be used within a MultiSelect component"
    );
  }
  return context;
};

export const MultiSelectTitle: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...props }) => {
  const { isOpen, setIsOpen } = useMultiSelectContext();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div {...props} onClick={toggleOpen} className={cn("flex", className)}>
      <p>{children}</p>
      <ChevronDown />
    </div>
  );
};

export const MultiSelectContent: React.FC<
  React.HTMLAttributes<HTMLUListElement>
> = ({ children, className, ...props }) => {
  const { isOpen } = useMultiSelectContext();
  return (
    <ul {...props} className={cn(isOpen ? "block" : "hidden", className)}>
      {children}
    </ul>
  );
};

export const MultiSelectItem: React.FC<React.HTMLAttributes<HTMLLIElement>> = ({
  children,
  className,
  ...props
}) => {
  const { isOpen } = useMultiSelectContext();
  return (
    <li {...props} className={cn(isOpen ? "block" : "hidden", className)}>
      {children}
    </li>
  );
};
