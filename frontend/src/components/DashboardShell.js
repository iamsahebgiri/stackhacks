import React, { useEffect } from "react";
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
} from "@chakra-ui/react";
import NavItem from "./NavItem";
import { RiHomeSmile2Fill } from "react-icons/ri";
import { IoFastFood, IoPersonCircle, IoAlbums } from "react-icons/io5";
import isAuthenticated from "../../utils/isAuthenticated";

function DashboardShell(props) {
  const router = useRouter();
  const navs = [
    {
      name: "Home",
      icon: RiHomeSmile2Fill,
      href: "home",
    },
    {
      name: "Items",
      icon: IoFastFood,
      href: "items",
    },
    {
      name: "Orders",
      icon: IoAlbums,
      href: "orders",
    },
    {
      name: "Account",
      icon: IoPersonCircle,
      href: "account",
    },
  ];

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } 

    if(JSON.parse(localStorage.getItem("user")).userType === "employee") {
      router.push("/home");
    }
  }, []);
  return (
    <Box>
      <Flex position="fixed">
        <Flex
          width="64px"
          flexDir="column"
          py="4"
          height="100vh"
          bg="gray.800"
          alignItems="center"
          justifyContent="space-between"
        >
          <Avatar size="sm" name="Oshigaki Kisame" src=""></Avatar>
          <Menu offset={[40, -30]}>
            <MenuButton>
              <Avatar
                size="sm"
                name="Dan Abrahmov"
                fallbackSrc="https://via.placeholder.com/100/000000/FFFFFF/"
                src={`http://localhost:3030/${JSON.parse(localStorage.getItem("user"))?.profilePicture}`}
              />
            </MenuButton>
            <MenuList>
              <MenuGroup title="Account">
                <MenuItem
                  fontSize="sm"
                  onClick={() => {
                    router.push("/admin/account");
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
        </Flex>
        <Flex
          width="224px"
          flexDir="column"
          py="4"
          height="100vh"
          bg="gray.200"
        >
          <Box px="4">
            {navs.map((nav) => (
              <NavItem
                href={`/admin/${nav.href}`}
                key={nav.name}
                icon={nav.icon}
                isActive={router.pathname.startsWith(`/admin/${nav.href}`)}
              >
                {nav.name}
              </NavItem>
            ))}
          </Box>
        </Flex>
      </Flex>

      <Box ml="288px" minH="100vh">
        {props.children}
      </Box>
    </Box>
  );
}

export default DashboardShell;
