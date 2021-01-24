import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Flex,
  Heading,
  Icon,
  Stack,
  Box,
  createStandaloneToast,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import DashboardShell from "../../../../components/DashboardShell";
import FoodItemForm from "../../../../components/FoodItemForm";

function EditFoodItem() {
  const toast = createStandaloneToast();
  const router = useRouter();
  const foodItemId = router.asPath.split("/")[4];
  const [foodItem, setFoodItem] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:3030/api/fooditems/${foodItemId}`)
      .then((response) => {
        console.log(response.data.foodItem)
        setFoodItem(response.data.foodItem);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, [foodItemId]);

  const deleteFoodItemFn = (foodItemId) => {
    axios
      .delete(`http://localhost:3030/api/fooditems/${foodItemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        toast({
          position: "top-right",
          title: "Food deleted successfully. ",
          description: response.data.message,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        router.push("/admin/items");
      })
      .catch((error) => {
        console.log(error.response);
        toast({
          position: "top-right",
          title: "An error occured",
          description: "Sorry for inconvenience",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  const formSubmitFn = (formData, actions) => {
    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    axios
      .put(`http://localhost:3030/api/fooditems/${foodItemId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        actions.setSubmitting(false);
        console.log(response.data);
        toast({
          position: "top-right",
          title: "Food created.",
          description: "We've updated a food for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        router.push("/admin/items");
      })
      .catch((error) => {
        const errors = error.response;
        console.log(errors.data.errors.message);

        toast({
          position: "top-right",
          title: "An error occurred.",
          description: errors.data.errors.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });

        actions.setSubmitting(false);
      });
  };

  return (
    <DashboardShell>
      <Flex flexDir="column" flex="1" p="6">
        <Stack
          direction={"row"}
          borderBottom="1px"
          borderColor="gray.200"
          pb="3"
          alignItems="center"
          justifyContent="space-between"
          spacing="5"
        >
          <Flex>
            <Link href="/admin/items">
              <a>
                <Box p="2">
                  <Icon as={IoArrowBack} color="gray.600" h={6} w={6} />
                </Box>
              </a>
            </Link>
            <Heading color="gray.800" size="lg">
              Edit Food Item
            </Heading>
          </Flex>
          <Button
            colorScheme="red"
            onClick={() => deleteFoodItemFn(foodItemId)}
          >
            Delete
          </Button>
        </Stack>
        <FoodItemForm
          formSubmitFn={formSubmitFn}
          btnType="Update"
          foodItem={foodItem}
        />
      </Flex>
    </DashboardShell>
  );
}

export default EditFoodItem;
