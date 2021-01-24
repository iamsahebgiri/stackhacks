import React, { useState, useEffect } from "react";
import { Field, Form, Formik } from "formik";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Flex,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Select,
  Textarea,
  Text,
  Button,
  FormErrorMessage,
  Image,
  createStandaloneToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useStoreActions, useStoreState } from "easy-peasy";
import EmployeeAccountSchema from "../../schema/EmployeeAccountSchema";

function EmployeeAccountForm() {
  const user = useStoreState((state) => state.user);
  const getUser = useStoreActions((actions) => actions.getUser);
  const [isDisabled, setIsDisabled] = useState(true);
  const handleClick = () => setShow(!show);
  const toast = createStandaloneToast();

  useEffect(() => {
    getUser();
  }, []);

  const [file, setFile] = useState({});
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: "image/jpeg, image/png",
    onDrop: (acceptedFile) => {
      console.log(acceptedFile[0]);
      setFile(
        Object.assign(acceptedFile[0], {
          preview: URL.createObjectURL(acceptedFile[0]),
        })
      );
      console.log(file);
    },
  });

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      URL.revokeObjectURL(file.preview);
    },
    [file]
  );

  const uploadImage = () => {
    let formData = new FormData();

    if (file) {
      formData.append("profilePicture", file);
    }
    axios
      .put("http://localhost:3030/api/users/account/profilePicture", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        toast({
          position: "bottom-left",
          title: "Photo updated successfully!",
          description: "We've updated your display picture.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        // router.push("/admin/items");
        getUser();
        setFile({});
      })
      .catch((error) => {
        console.log(error.response);

        toast({
          position: "bottom-left",
          title: "An error occurred.",
          description: "Sorry for inconvenience.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          firstName: typeof user !== null ? user.name?.split(" ")[0] : "",
          lastName: typeof user !== null ? user.name?.split(" ")[1] : "",
          employeeId: typeof user !== null ? user.extraInfo?.employeeId : "",
          organization:
            typeof user !== null ? user.extraInfo?.organization : "",
          mobileNo: typeof user !== null ? user.extraInfo?.mobileNo : "",
        }}
        validationSchema={EmployeeAccountSchema}
        onSubmit={(values, actions) => {
          // console.log();
          const data = {
            user: {
              name: `${values.firstName} ${values.lastName}`,
              extraInfo: {
                employeeId: values.employeeId,
                organization: values.organization,
                mobileNo: values.mobileNo,
                identityCard: values.identityCard,
              },
            },
          };
          axios
            .put("http://localhost:3030/api/users/account", data, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((response) => {
              actions.setSubmitting(false);
              console.log(response.data.user);
              toast({
                position: "bottom-left",
                title: "Profile has been updated.",
                description: "Profile info saved successfully.",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
            })
            .catch((error) => {
              toast({
                position: "bottom-left",
                title: "An error occurred.",
                description: "Sorry for inconvenience.",
                status: "error",
                duration: 9000,
                isClosable: true,
              });
              actions.setSubmitting(false);
            });
        }}
      >
        {(props) => (
          <Form>
            <Flex flexDirection="column">
              <Flex fontWeight="600" mb="4">
                Account Settings
              </Flex>
              <Box shadow="sm" bg="white" rounded="md" p="4">
                <Stack spacing="4">
                  <Stack spacing="4" direction="row">
                    <Field name="firstName">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.firstName && form.touched.firstName
                          }
                          isRequired
                        >
                          <FormLabel htmlFor="email">First Name</FormLabel>
                          <Input
                            {...field}
                            id="firstName"
                            placeholder="Saheb"
                            disabled={isDisabled}
                            focusBorderColor="teal.500"
                          />
                          <FormErrorMessage>
                            {form.errors.firstName}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="lastName">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.lastName && form.touched.lastName
                          }
                          isRequired
                        >
                          <FormLabel htmlFor="email">Last Name</FormLabel>
                          <Input
                            {...field}
                            id="lastName"
                            placeholder="Giri"
                            disabled={isDisabled}
                            focusBorderColor="teal.500"
                          />
                          <FormErrorMessage>
                            {form.errors.lastName}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                  <Stack spacing="4" direction="row">
                    <Field name="employeeId">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.employeeId && form.touched.employeeId
                          }
                          isRequired
                        >
                          <FormLabel htmlFor="email">Employee Id</FormLabel>
                          <Input
                            {...field}
                            id="employeeId"
                            placeholder="ABC123"
                            disabled={isDisabled}
                            focusBorderColor="teal.500"
                          />
                          <FormErrorMessage>
                            {form.errors.employeeId}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="organization">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.organization &&
                            form.touched.organization
                          }
                          isRequired
                        >
                          <FormLabel htmlFor="email">Organization</FormLabel>
                          <Input
                            {...field}
                            id="organization"
                            placeholder="Microsoft"
                            disabled={isDisabled}
                            focusBorderColor="teal.500"
                          />
                          <FormErrorMessage>
                            {form.errors.organization}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                  <Field name="mobileNo">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.mobileNo && form.touched.mobileNo
                        }
                        isRequired
                      >
                        <FormLabel htmlFor="email">Contact No</FormLabel>
                        <Input
                          {...field}
                          id="mobileNo"
                          placeholder="9876543210"
                          disabled={isDisabled}
                          focusBorderColor="teal.500"
                        />
                        <FormErrorMessage>
                          {form.errors.mobileNo}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Flex justifyContent="flex-end">
                    <Button
                      colorScheme="teal"
                      onClick={() => {
                        setIsDisabled((state) => !state);
                        if (!isDisabled) {
                          props.submitForm();
                        }
                      }}
                    >
                      {isDisabled ? "Edit" : "Save"}
                    </Button>
                  </Flex>
                </Stack>
              </Box>
            </Flex>
          </Form>
        )}
      </Formik>
      <Flex flexDirection="column" mt="4">
        <Flex fontWeight="600" mb="4">
          Identity Card
        </Flex>
        <Box shadow="sm" bg="white" rounded="md" p="4">
            <Flex
              alignItems="center"
              justifyContent="center"
              padding="12"
              borderWidth="2px"
              rounded="md"
              borderStyle="dashed"
              mb="4"
            >
              <Text
                width="sm"
                textAlign="center"
                fontSize="sm"
                color="gray.600"
              >
                Upload a file or drag and drop PNG, JPG up to 2MB
              </Text>
            </Flex>
          <Image

                src={file?.preview}
              />
          <Flex justifyContent="flex-end">
          {Object.keys(file).length !== 0 ? (
              <Button onClick={uploadImage}>Upload</Button>
            ) : (
              <Box {...getRootProps({ className: "dropzone" })} mt="4">
                <Input {...getInputProps()} />
                <Button colorScheme="teal">Update Identity</Button>
              </Box>
            )}
            </Flex>
        </Box>
      </Flex>
    </>
  );
}

export default EmployeeAccountForm;
