import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import NavItem from "./NavItem";
import { RiHomeSmile2Fill } from "react-icons/ri";
import { IoFastFood, IoPersonCircle, IoAlbums } from "react-icons/io5";
import isAuthenticated from "../../utils/isAuthenticated";
import { useStoreActions, useStoreState } from "easy-peasy";

const HeaderNavItem = (props) => {
  return (
    <Link {...props}>
      <Flex
        py="2"
        px="3"
        mr="2"
        rounded="md"
        alignItems="center"
        bg={props.isActive && "gray.800"}
        _hover={{
          cursor: "pointer",
          bg: props.isActive ? "gray.800" : "gray.600",
        }}
      >
        <Text
          fontWeight="500"
          fontSize="sm"
          color={props.isActive ? "white" : "gray.300"}
        >
          {props.children}
        </Text>
      </Flex>
    </Link>
  );
};

function Header() {
  const router = useRouter();
  const getUser = useStoreActions((actions) => actions.getUser);
  const user = useStoreState((state) => state.user);
  const navs = [
    {
      name: "Home",
      icon: RiHomeSmile2Fill,
      href: "home",
    },
    {
      name: "Store",
      icon: IoFastFood,
      href: "store",
    },
    {
      name: "Account",
      icon: IoPersonCircle,
      href: "account",
    },
  ];

  // useEffect(() => {
  //   getUser();
  // }, []);
  return (
    <Flex
      bg="gray.700"
      px="2"
      py="2"
      justifyContent="space-between"
      alignItems="center"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Box h="8" w="8" mx="6" bg="teal.500"></Box>
        <Flex ml="6" justifyContent="space-between" alignItems="center">
          {navs.map((nav) => (
            <HeaderNavItem
              href={`/${nav.href}`}
              key={nav.name}
              isActive={router.pathname.startsWith(`/${nav.href}`)}
            >
              {nav.name}
            </HeaderNavItem>
          ))}
        </Flex>
      </Flex>
      <Box>
        <Menu>
          <MenuButton>
            <Avatar
              size="sm"
              
              src={`http://localhost:3030/${user?.profilePicture}`}
            />
          </MenuButton>
          <MenuList>
            <MenuGroup title="Account">
              <MenuItem
                fontSize="sm"
                onClick={() => {
                  router.push("/account");
                }}
              >
                Settings
              </MenuItem>
              <MenuItem
                fontSize="sm"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  router.push("/login");
                }}
              >
                Sign Out
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
}

export default Header;
