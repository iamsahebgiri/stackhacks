import { useRouter } from "next/router";
import React, { useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  Stack,
  Badge,
} from "@chakra-ui/react";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Icon } from "@chakra-ui/react";
import { IoTimerOutline } from "react-icons/io5";
import isAuthenticated from "../../utils/isAuthenticated";
import Header from "../components/Header";
import OrdersTable from "../components/OrdersTable";

const Queue = () => {
  return (
    <Flex
      height="80px"
      bg="white"
      rounded="md"
      shadow="sm"
      alignItems="center"
      justifyContent="space-between"
      p="3"
      width="500px"
    >
      <Flex alignItems="center">
        {/* <Box mr="3">
          <Heading color="gray.400">01</Heading>
        </Box> */}
        <Image
          borderRadius="full"
          boxSize="60px"
          src="https://bit.ly/sage-adebayo"
          alt="Segun Adebayo"
        />
        <Stack ml="3" spacing={0}>
          <Heading size="sm" m={0}>
            Saheb Giri
          </Heading>
          <Text m={0} fontSize="sm" color="gray.500">
            Student
          </Text>
        </Stack>
      </Flex>
      <Box>
        <Heading color="gray.400">01</Heading>
      </Box>
    </Flex>
  );
};
const Order = ({ order }) => {
  return (
    <Flex
      height="80px"
      bg="white"
      rounded="md"
      shadow="sm"
      alignItems="center"
      justifyContent="space-between"
      p="3"
      width="500px"
    >
      <Flex alignItems="center">
        {/* <Image
          borderRadius="full"
          boxSize="60px"
          
        /> */}
        <Stack ml="3" spacing={0}>
          <Heading size="sm" m={0}>
            {order.item.name}
          </Heading>
          {/* <Text m={0} fontSize="sm" color="gray.500">
            Student
          </Text> */}
        </Stack>
      </Flex>
      <Box>
        <Badge>{order.status}</Badge>
      </Box>
    </Flex>
  );
};

function Home() {
  const router = useRouter();
  const orders = useStoreState((state) => state.orders);
  const getUser = useStoreActions((actions) => actions.getUser);
  const getOrdersByMe = useStoreActions((actions) => actions.getOrdersByMe);

  useEffect(() => {
    getUser();
    getOrdersByMe();
  }, []);

  return (
    <>
      <Header />
      <Flex justifyContent="center" bg="gray.50" minH="100vh">
        <Box width="xl" p="3">
          <Heading
            size="lg"
            borderBottom="1px"
            borderColor="gray.200"
            pb="3"
            mt="10"
          >
            In Queue
          </Heading>
          <Box p="16">
            <Image src="/assets/svg/undraw_city_life_gnpr.svg" />
            <Text textAlign="center" color="gray.500" mt="6">
              There is no one in the queue.
            </Text>
          </Box>
          <Stack spacing="3" mt="3">
            {/* <Queue />
            <Queue />
            <Queue /> */}
          </Stack>
          <Heading
            size="lg"
            borderBottom="1px"
            borderColor="gray.200"
            pb="3"
            mt="10"
          >
            Your Orders
          </Heading>
          <Flex justifyContent="center" py="4">
            <Stack spacing="4">
              {orders.map((order) => (
                <Order key={order._id} order={order} />
              ))}
            </Stack>
          </Flex>
          {Object.keys(orders).length === 0 && (
            <Box p="28">
              <Image src="/assets/svg/undraw_Select_re_3kbd.svg" />
              <Text textAlign="center" color="gray.500" mt="6">
                You have not placed any orders yet.
              </Text>
            </Box>
          )}

          {/* <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            my="3"
          >
            <Icon as={IoTimerOutline} h="12" w="12" color="gray.400" />
            <Text mt="2">Food will be cooked with in 30:00 min</Text>
          </Flex> */}
        </Box>
      </Flex>
    </>
  );
}

export default Home;
