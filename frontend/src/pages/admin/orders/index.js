import React, { useEffect } from "react";
import { Flex, Stack, Box, Heading } from "@chakra-ui/react";
import { useStoreActions } from "easy-peasy";
import DashboardShell from "../../../components/DashboardShell";
import OrdersTable from "../../../components/OrdersTable";

function Categories() {
  const getAllCategories = useStoreActions(
    (actions) => actions.getAllCategories
  );

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <DashboardShell>
      <Flex p="6" flex="1" direction="column" bg="gray.50" minH="100vh">
        <Stack
          direction={"row"}
          borderBottom="1px"
          borderColor="gray.200"
          pb="3"
          alignItems="center"
          spacing="5"
        >
          <Heading color="gray.800" size="lg">
            All orders
          </Heading>
        </Stack>
        <Box bg="white" mt="2" shadow="sm" py="6" rounded="md">
          <OrdersTable />
        </Box>
      </Flex>
    </DashboardShell>
  );
}

export default Categories;
