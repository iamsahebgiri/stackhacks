import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Box, Flex, Heading, Select, Stack } from "@chakra-ui/react";
import Header from "../components/Header";
import FoodItem from "../components/FoodItem";


function Store() {
  const router = useRouter();
  const foodItems = useStoreState((state) => state.foodItems);
  const getAllFoodItems = useStoreActions((actions) => actions.getAllFoodItems);

  useEffect(() => {
    getAllFoodItems();
  }, []);

  return (
    <Box>
      <Header />
      <Box bg="gray.50" minH="100vh">
        <Flex flexDir="column" alignItems="center" py="4">
          <Flex width="xl" py="4" alignItems="center" justifyContent="space-between">
            <Heading size="md">Filter</Heading>
            <Box>
              <Select placeholder="Select Category">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </Box>
          </Flex>
          <Flex
            mt="6"
            flexWrap="wrap"
            width="xl"
            justifyContent="space-around"
            alignItems="center"
          >
            {foodItems.map((foodItem) => (
              <FoodItem key={foodItem.id} {...foodItem}></FoodItem>
            ))}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}

export default Store;
