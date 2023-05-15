import { Select, Text } from "@chakra-ui/react";
import { useRefinementList } from "react-instantsearch-hooks-web";

export const RefinementList = () => {
  const { items, refine } = useRefinementList({
    attribute: "breedGroup",
    sortBy: ["name:asc"],
  });
  return (
    <Select
      variant="unstyled"
      onChange={(e) => {
        refine(e.target.value);
      }}
    >
      {
        // eslint-disable-next-line
        items.map((item: any) => (
          <option key={item.name} value={item.value}>
            <Text casing="capitalize">{item.label}</Text>
          </option>
        ))
      }
    </Select>
  );
};
