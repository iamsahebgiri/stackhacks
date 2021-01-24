import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Link as UILink,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { Icon } from "@chakra-ui/react";
import { IoCheckmarkCircle } from "react-icons/io5";
import SignupSchema from "../../schema/SignupSchema";
import { Container } from "../components/Container";

const SignupForm = () => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const router = useRouter();

  const [isEmployee, setIsEmployee] = React.useState(true);

  React.useEffect(() => {}, []);

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
      }}
      validationSchema={SignupSchema}
      onSubmit={(values, actions) => {
        console.log({
          ...values,
          userType: isEmployee ? "employee" : "vendor",
        });
        axios
          .post("http://localhost:3030/api/users/signup", {
            user: {
              ...values,
              userType: isEmployee ? "employee" : "vendor",
            },
          })
          .then((response) => {
            actions.setSubmitting(false);
            console.log(response.data.user.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", response.data.user.token);
            if (response.data.user.userType === "employee") {
              router.push("/home");
            } else {
              router.push("/admin/home");
            }
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            for (let key in errors) {
              toast({
                position: "bottom-right",
                title: "An error occurred.",
                description: errors[key],
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            }
            actions.setSubmitting(false);
          });
      }}
    >
      {(props) => (
        <Form>
          <Stack spacing="4">
            <Box>
              <FormControl isRequired>
                <FormLabel>I am a/an</FormLabel>
              </FormControl>
              <Stack direction={["column", "row"]}>
                <Box
                  bg={isEmployee ? "teal.50" : "gray.100"}
                  p="2"
                  pl="4"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  border="2px solid"
                  borderColor={isEmployee ? "teal.400" : "gray.200"}
                  borderRadius="6px"
                  width={["100%", "50%"]}
                  onClick={() => setIsEmployee(true)}
                  cursor="pointer"
                  userSelect="none"
                >
                  <Text>Employee</Text>
                  {isEmployee ? (
                    <Icon as={IoCheckmarkCircle} color="teal.400" />
                  ) : null}
                </Box>
                <Box
                  bg={isEmployee ? "gray.100" : "teal.50"}
                  p="2"
                  pl="4"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  border="2px solid"
                  borderColor={isEmployee ? "gray.200" : "teal.400"}
                  borderRadius="6px"
                  width={["100%", "50%"]}
                  onClick={() => setIsEmployee(false)}
                  cursor="pointer"
                  userSelect="none"
                >
                  <Text>Vendor</Text>
                  {isEmployee ? null : (
                    <Icon as={IoCheckmarkCircle} color="teal.400" />
                  )}
                </Box>
              </Stack>
            </Box>

            <Field name="username">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.username && form.touched.username}
                  isRequired
                >
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Input
                    {...field}
                    id="username"
                    placeholder="iamsahebgiri"
                    focusBorderColor="teal.500"
                  />
                  <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="email">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.email && form.touched.email}
                  isRequired
                >
                  <FormLabel htmlFor="email">Email Address</FormLabel>
                  <Input
                    {...field}
                    id="email"
                    placeholder="iamsahebgiri@gmail.com"
                    focusBorderColor="teal.500"
                  />
                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.password && form.touched.password}
                  isRequired
                >
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <InputGroup size="md">
                    <Input
                      {...field}
                      id="password"
                      pr="4.5rem"
                      type={show ? "text" : "password"}
                      placeholder="Enter password"
                      focusBorderColor="teal.500"
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>

                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </Stack>
          <Flex>
            <Spacer />
            <Button
              mt={[6, 12]}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
              width="100%"
            >
              Register
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

const SignUp = () => {
  return (
    <Container height="100vh">
      <Box
        bg="gray.600"
        display={["none", "block"]}
        width="50%"
        height="100vh"
        bgPosition="center"
        bgSize="cover"
        bgImg="url('https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=100')"
      />
      <Box
        width={["100%", "50%"]}
        px={["4"]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box width="md">
          <Heading mb="6">Register</Heading>
          <SignupForm />
          <Text my="4" textAlign="center">
            Alredy have an account?{" "}
            <Link href="/login">
              <UILink color="teal.400">Sign In</UILink>
            </Link>
          </Text>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
