import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { Field, Form, Formik } from "formik";
import {
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Icon,
  InputGroup,
  InputLeftElement,
  Stack,
  Box,
  Button,
  Select,
  Divider,
  Text,
  Image,
  useDisclosure,
  Switch,
  Spacer,
} from "@chakra-ui/react";
import { useStoreState, useStoreActions } from "easy-peasy";
import FoodItemSchema from "./../../schema/FoodItemSchema";
import { IoImageOutline } from "react-icons/io5";
import CreateCategoryDrawer from "./CreateCategoryDrawer";

function FoodItemForm({ formSubmitFn, btnType = "Submit", foodItem }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const categories = useStoreState((state) => state.categories);

  const [inStock, setInStock] = useState(true);
  const [vegFood, setVegFood] = useState(true);

  const getAllCategories = useStoreActions(
    (actions) => actions.getAllCategories
  );

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

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    if (foodItem) {
      setInStock(foodItem.inStock);
      setVegFood(foodItem.foodType == "vegetarian");
    }
  }, [foodItem]);

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      URL.revokeObjectURL(file.preview);
    },
    [file]
  );
  return (
    <Stack alignItems="center">
      <Flex my="12" width="md">
        <Formik
          enableReinitialize={true}
          initialValues={{
            name: foodItem ? foodItem.name : "",
            price: foodItem ? foodItem.price : 0,
            category: foodItem ? foodItem.category?.id : "",
          }}
          validationSchema={FoodItemSchema}
          onSubmit={(values, actions) => {
            let formData = new FormData();

            formData.append("name", values.name);
            formData.append("price", values.price);
            formData.append("category", values.category);
            if (file) {
              formData.append("picture", file);
            }
            formData.append("inStock", inStock);
            formData.append(
              "foodType",
              vegFood ? "vegetarian" : "non-vegetarian"
            );
            formSubmitFn(formData, actions);
          }}
        >
          {(props) => (
            <Form>
              <Stack spacing="4">
                <Box>
                  <Box
                    padding="12"
                    borderWidth="2px"
                    rounded="md"
                    borderStyle="dashed"
                    textAlign="center"
                    _hover={{ cursor: "pointer" }}
                    _focus={{ outline: "none" }}
                    {...getRootProps({ className: "dropzone" })}
                  >
                    <Input {...getInputProps()} />
                    <Icon as={IoImageOutline} color="gray.300" h={8} w={8} />
                    <Text fontSize="md" color="gray.600">
                      Drag & drop image here, or click to select a image
                    </Text>
                  </Box>
                </Box>
                <Box key={file.name}>
                  <Box>
                    <Image
                      border="none"
                      boxSize="md"
                      objectFit="cover"
                      fallbackSrc="https://via.placeholder.com/250/000000/FFFFFF/?text=Add an image"
                      rounded="md"
                      src={
                        foodItem
                          ? `http://localhost:3030/${foodItem.picture}`
                          : file.preview
                      }
                    />
                  </Box>
                </Box>
                <Field name="name">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.name && form.touched.name}
                      isRequired
                    >
                      <FormLabel htmlFor="name">Name of food</FormLabel>
                      <Input
                        {...field}
                        id="name"
                        placeholder="Coke"
                        focusBorderColor="teal.500"
                      />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="price">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.price && form.touched.price}
                      isRequired
                    >
                      <FormLabel htmlFor="price">Price</FormLabel>
                      <InputGroup>
                        <InputLeftElement
                          pointerEvents="none"
                          color="gray.300"
                          fontSize="1.2em"
                          children="₹"
                        />
                        <Input
                          {...field}
                          placeholder="20"
                          type="number"
                          focusBorderColor="teal.500"
                          id="price"
                        />
                      </InputGroup>
                      <FormErrorMessage>{form.errors.price}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="category">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.category && form.touched.category}
                      isRequired
                    >
                      <FormLabel htmlFor="category">
                        Select a category
                      </FormLabel>
                      <Select
                        {...field}
                        id="category"
                        placeholder="Category"
                        focusBorderColor="teal.500"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>
                        {form.errors.category}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Flex fontSize="sm">
                  <Text mr="2" color="gray.600">
                    Didn't find appropriate category?
                  </Text>
                  <Text
                    color="teal.500"
                    onClick={onOpen}
                    _hover={{
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Create category
                  </Text>
                </Flex>
                <FormControl display="flex" alignItems="center" isRequired>
                  <FormLabel htmlFor="vegFood" mb="0">
                    Vegetarian food
                  </FormLabel>
                  <Spacer></Spacer>
                  <Switch
                    id="vegFood"
                    colorScheme="teal"
                    isChecked={vegFood}
                    onChange={() => setVegFood((state) => !state)}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center" isRequired>
                  <FormLabel htmlFor="inStock" mb="0">
                    In stock
                  </FormLabel>
                  <Spacer></Spacer>
                  <Switch
                    id="inStock"
                    colorScheme="teal"
                    isChecked={inStock}
                    onChange={() => setInStock((state) => !state)}
                  />
                </FormControl>
              </Stack>
              <Stack mt="6" spacing="3">
                <Button
                  colorScheme="teal"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  {btnType}
                </Button>
                <Link href="/admin/items">
                  <Button>Cancel</Button>
                </Link>
              </Stack>
            </Form>
          )}
        </Formik>
        <CreateCategoryDrawer onClose={onClose} isOpen={isOpen} />
      </Flex>
    </Stack>
  );
}

export default FoodItemForm;
