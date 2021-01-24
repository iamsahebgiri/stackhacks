import React from "react";
import Link from "next/link";
import {
  Flex,
  Button,
  Stack,
  Image,
  Heading,
  Text,
  Box,
  createStandaloneToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useStoreActions, useStoreState } from "easy-peasy";

const FoodItem = ({
  id,
  name,
  picture,
  price,
  category,
  foodType,
  userCreated,
  isEditable,
}) => {
  const toast = createStandaloneToast();
  const router = useRouter();
  const deleteFoodItem = useStoreActions((actions) => actions.deleteFoodItem);
  return (
    <Flex
      width="500px"
      p="2"
      rounded="md"
      mb="4"
      bg="white"
      shadow="sm"
      _hover={{}}
      alignItems="self-end"
      justifyContent="space-between"
    >
      <Flex>
        <Image
          rounded="md"
          boxSize="120px"
          objectFit="cover"
          src={`http://localhost:3030/${picture}`}
          alt={name}
        />
        <Stack ml="4">
          <Heading fontSize="lg" m="0">
            {name}
          </Heading>
          <Flex>
            <Flex fontSize="sm" fontWeight="500" color="gray.600">
              <Text>₹ {price} </Text>
              <Text mx="1">·</Text>
              <Text>{category?.name}</Text>
              <Text mx="1">·</Text>
              <Text>{foodType}</Text>
            </Flex>
          </Flex>
          <Flex fontSize="sm">
            <Text display="inline-block" color="gray.600" mr="1">
              By
            </Text>
            <Text>
              {userCreated.name !== null
                ? userCreated.name
                : userCreated.username}
            </Text>
          </Flex>
          <Flex>
            {isEditable ? (
              <>
                <Button
                  size="sm"
                  width="120px"
                  mr="2"
                  onClick={() => {
                    router.push({
                      pathname: "/admin/items/edit/[foodItemId]",
                      query: { foodItemId: id },
                    });
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  width="120px"
                  onClick={() => {
                    axios
                      .delete(`http://localhost:3030/api/fooditems/${id}`, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
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
                    deleteFoodItem(id);
                  }}
                >
                  Delete
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                width="120px"
                onClick={() => {
                  // console.log("sas");
                  axios
                    .post(
                      "http://localhost:3030/api/orders/create",
                      { item: id },
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      }
                    )
                    .then((response) => {
                      router.push("/home");
                      toast({
                        position: "bottom-left",
                        title: "Your order has been placed.",
                        description: "You will be served within five mintues.",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                      });
                      console.log(response.data);
                    })
                    .catch((error) => {
                      console.log(error.response);
                    });
                }}
              >
                Place order
              </Button>
            )}
          </Flex>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default FoodItem;
