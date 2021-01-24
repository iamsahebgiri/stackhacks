import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Flex,
  Heading,
  Icon,
  Stack,
  Box,
  createStandaloneToast,
} from "@chakra-ui/react";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import DashboardShell from "../../../components/DashboardShell";
import FoodItemForm from "../../../components/FoodItemForm";

function CreateItem() {
  const toast = createStandaloneToast();
  const router = useRouter();

  const formSubmitFn = (formData, actions) => {
    // console.log(formData.entries());
    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    axios
      .post("http://localhost:3030/api/fooditems/create", formData, {
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
          description: "We've created a food for you.",
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
          spacing="5"
        >
          <Link href="/admin/items">
            <a>
              <Box p="2">
                <Icon as={IoArrowBack} color="gray.600" h={6} w={6} />
              </Box>
            </a>
          </Link>
          <Heading color="gray.800" size="lg">
            Add Food Item
          </Heading>
        </Stack>
        <FoodItemForm formSubmitFn={formSubmitFn} btnType="Submit" />
      </Flex>
    </DashboardShell>
  );
}

export default CreateItem;
