import type { SelectProps } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
// import * as React from "react";

const sortByOptions = {
  defaultValue: "best-seller",
  options: [
    { label: "Best Seller", value: "best-seller" },
    { label: "Best Match", value: "best-match" },
    { label: "Price: Low to High", value: "low-to-high" },
    { label: "Price: High to Low", value: "high-to-low" },
  ],
};

export const SortbySelect = (props: SelectProps) => (
  <Select
    aria-label="Sort by"
    defaultValue={sortByOptions.defaultValue}
    rounded="md"
    {...props}
  >
    {sortByOptions.options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </Select>
);
