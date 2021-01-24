import React, { useEffect } from "react";
import Link from "next/link";
import { Flex, Button, Stack, Image, Heading, Text } from "@chakra-ui/react";
import { useStoreState, useStoreActions } from "easy-peasy";
import DashboardShell from "../../../components/DashboardShell";
import { AddIcon } from "@chakra-ui/icons";
import isAuthenticted from "../../../../utils/isAuthenticated";
import { useRouter } from "next/router";
import FoodItem from "../../../components/FoodItem";

function Items() {
  const router = useRouter();
  const foodItems = useStoreState((state) => state.foodItems);
  const getFoodItemsByMe = useStoreActions((actions) => actions.getFoodItemsByMe);

  useEffect(() => {
    if (!isAuthenticted) {
      router.push("/login");
    } else {
      getFoodItemsByMe();
    }
  }, []);

  return (
    <DashboardShell>
      <Flex p="6" flex="1" direction="column" bg="gray.50" minH="100vh">
        <Stack
          direction={"row"}
          borderBottom="1px"
          borderColor="gray.200"
          pb="3"
          mb="6"
          alignItems="center"
          spacing="5"
          justifyContent="space-between"
        >
          <Heading color="gray.800" size="lg">
            Food Items
          </Heading>
          <Link href="/admin/items/create">
            <a>
              <Button leftIcon={<AddIcon />} colorScheme="teal">
                Add Food
              </Button>
            </a>
          </Link>
        </Stack>

        <Flex flexWrap="wrap" justifyContent="space-between">
          {foodItems.map((foodItem) => (
            <FoodItem isEditable key={foodItem.id} {...foodItem}></FoodItem>
          ))}
        </Flex>
      </Flex>
    </DashboardShell>
  );
}

export default Items;
