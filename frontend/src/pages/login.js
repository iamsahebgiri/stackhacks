import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Link as UILink,
  Stack,
  Text,
  Flex,
  Spacer,
  createStandaloneToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Container } from "../components/Container";
import SigninSchema from "../../schema/SigninSchema";

const SigninForm = () => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const toast = createStandaloneToast();
  const router = useRouter();
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={SigninSchema}
      onSubmit={(values, actions) => {
        axios
          .post("http://localhost:3030/api/users/login", {
            user: {
              ...values,
            },
          })
          .then((response) => {
            actions.setSubmitting(false);
            // console.log(response.data.user.token);
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
                position: "bottom-left",
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
              mt={12}
              width="100%"
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Signin
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

const SignIn = () => {
  return (
    <Container height="100vh">
      <Box
        width={["100%", "50%"]}
        px={["4"]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box width="md">
          <Heading mb="6">Sign In</Heading>
          <SigninForm />
          <Text my="4" textAlign="center">
            Don't have an account?{" "}
            <Link href="/register">
              <UILink color="teal.400">Register</UILink>
            </Link>
          </Text>
        </Box>
      </Box>
      <Box
        bg="gray.600"
        display={["none", "block"]}
        width="50%"
        height="100vh"
        bgPosition="center"
        bgSize="cover"
        bgImg="url('https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=500&q=100')"
      />
    </Container>
  );
};

export default SignIn;
