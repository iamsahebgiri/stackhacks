import {
  Flex,
  Box,
  Heading,
  Stat,
  StatHelpText,
  StatNumber,
  StatLabel,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import DashboardShell from "../../components/DashboardShell";
import OrdersTable from "../../components/OrdersTable";

function Home() {
  return (
    <DashboardShell>
      <Flex flexDir="column" flex="1" bg="gray.50" p="6">
        <Heading size="lg" borderBottom="1px" borderColor="gray.200" pb="3">
          Overview
        </Heading>
        <Flex py="4" mt="3">
          <Stack direction={["column", "row"]} spacing="5" width="100%">
            <Stat>
              <Box shadow="sm" p="6" rounded="md" bg="white">
                <StatLabel>Sales</StatLabel>
                <StatNumber>₹ 0.00</StatNumber>
                <StatHelpText>Feb 12 - Feb 28</StatHelpText>
              </Box>
            </Stat>
            <Stat>
              <Box shadow="sm" p="6" rounded="md" bg="white">
                <StatLabel>Total Orders</StatLabel>
                <StatNumber>58</StatNumber>
                <StatHelpText>Feb 12 - Feb 28</StatHelpText>
              </Box>
            </Stat>
            <Stat>
              <Box shadow="sm" p="6" rounded="md" bg="white">
                <StatLabel>Unfullfilled Orders</StatLabel>
                <StatNumber>10</StatNumber>
                <StatHelpText>Feb 12 - Feb 28</StatHelpText>
              </Box>
            </Stat>
          </Stack>
        </Flex>
        <Heading
          size="lg"
          borderBottom="1px"
          borderColor="gray.200"
          pb="3"
          mt="10"
        >
          Recent Orders
        </Heading>
        <Box bg="white" mt="6" shadow="sm" py="6" rounded="md">
          <OrdersTable n={1} />
        </Box>
      </Flex>
    </DashboardShell>
  );
}

export default Home;
