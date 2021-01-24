import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
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
import UpdateOrderSchema from "../../schema/UpdateOrderSchema";

function EditOrderModal({ isOpen, onClose, id }) {
  const toast = createStandaloneToast();
  const updateOrder = useStoreActions((actions) => actions.updateOrder);
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
          <ModalHeader>Update Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ status: "pending", estimatedTime: 5 }}
              validationSchema={UpdateOrderSchema}
              onSubmit={(values, actions) => {
                console.log(values);
                axios
                  .put(`http://localhost:3030/api/orders/${id}`, values, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  })
                  .then((response) => {
                    actions.setSubmitting(false);
                    console.log(response.data);
                    updateOrder({ ...values, id });
                    toast({
                      position: "top-right",
                      title: "Order updated.",
                      description: "Order has been updated",
                      status: "success",
                      duration: 9000,
                      isClosable: true,
                    });
                    onClose();
                  })
                  .catch((error) => {
                    console.log(error.response);
                    toast({
                      position: "top-right",
                      title: "An error occurred.",
                      description: "Somthing went wrong!",
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
                  <Stack spacing="4">
                    <Field name="status">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.status && form.touched.status}
                        >
                          <FormLabel htmlFor="status">Status</FormLabel>
                          <Select
                            {...field}
                            id="status"
                            placeholder="Select Status"
                          >
                            <option>pending</option>
                            <option>cooking</option>
                            <option>finished</option>
                          </Select>
                          <FormErrorMessage>
                            {form.errors.status}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="estimatedTime">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.estimatedTime &&
                            form.touched.estimatedTime
                          }
                        >
                          <FormLabel htmlFor="estimatedTime">
                            Estimated time(in min)
                          </FormLabel>
                          <Input
                            {...field}
                            type="number"
                            id="estimatedTime"
                            placeholder="5"
                            focusBorderColor="teal.500"
                          />
                          <FormErrorMessage>
                            {form.errors.estimatedTime}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
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

export default EditOrderModal;
