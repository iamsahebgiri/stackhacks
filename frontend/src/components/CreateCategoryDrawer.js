import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Stack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  createStandaloneToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useStoreActions } from "easy-peasy";
import CreateCategorySchema from "../../schema/CreateCategorySchema";

function CreateCategoryDrawer({ isOpen, onClose }) {
  const toast = createStandaloneToast();
  const addCategory = useStoreActions((actions) => actions.addCategory);
  return (
    <>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ name: "" }}
              validationSchema={CreateCategorySchema}
              onSubmit={(values, actions) => {
                console.log(values);
                axios
                  .post("http://localhost:3030/api/categories/create", {
                    ...values,
                  })
                  .then((response) => {
                    actions.setSubmitting(false);
                    console.log(response.data);
                    addCategory(response.data.category);
                    toast({
                      position: "top-right",
                      title: "Category created.",
                      description: "We've created a category for you.",
                      status: "success",
                      duration: 9000,
                      isClosable: true,
                    });
                    onClose();
                  })
                  .catch((error) => {
                    const errors = error.response.data.errors;
                    for (let key in errors) {
                      toast({
                        position: "top-right",
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
                  <Field name="name">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                        isRequired
                      >
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input
                          {...field}
                          id="name"
                          placeholder="Fast Food"
                          focusBorderColor="teal.500"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Stack my="4">
                    <Button
                      colorScheme="teal"
                      type="submit"
                      isLoading={props.isSubmitting}
                    >
                      Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateCategoryDrawer;
