import { Flex } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

const Dashboard = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      w="full"
    >
      <NextSeo title="Dashboard" />
    </Flex>
  );
};

export default Dashboard;
