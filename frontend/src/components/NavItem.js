import React from "react";
import Link from "next/link";
import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";

function NavItem(props) {
  return (
    <Link {...props}>
      <Flex
        py="2"
        px="3"
        mb="3"
        rounded="md"
        alignItems="center"
        bg={props.isActive && "teal.500"}
        _hover={{ cursor: "pointer", bg: props.isActive? "teal.500" : "gray.200" }}
      >
        <Icon as={props.icon} w={5} h={5} color={props.isActive? "white" : "gray.500"} mr={4} />
        <Text fontWeight="500" color={props.isActive? "white" : "gray.600"}>
          {props.children}
        </Text>
      </Flex>
    </Link>
  );
}

export default NavItem;
