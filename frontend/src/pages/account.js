import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Header from "../components/Header";
import EmployeeAccountForm from "../components/EmployeeAccountForm";
import {
  Box,
  Button,
  Flex,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Select,
  Textarea,
  Text,
  Image,
  createStandaloneToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useStoreActions, useStoreState } from "easy-peasy";

function Account() {
  const toast = createStandaloneToast();
  const user = useStoreState((state) => state.user);
  const getUser = useStoreActions((actions) => actions.getUser);

  const router = useRouter();

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
      <Header />

      <Flex bg="gray.50" alignItems="center" justifyContent="center" py="4">
        <Box width="xl">
          <Flex
            height="150px"
            p="3"
            bg="teal.500"
            rounded="md"
            justifyContent="flex-end"
          >
           {Object.keys(file).length !== 0 ? (
              <Button onClick={uploadImage}>Upload</Button>
            ) : (
              <Box {...getRootProps({ className: "dropzone" })}>
                <Input {...getInputProps()} />
                <Button>Edit profile picture</Button>
              </Box>
            )}
          </Flex>
          <Box mt="-120px" ml="30px" mb="6">
            {Object.keys(file).length === 0 ? (
              <Image
                borderRadius="full"
                boxSize="150px"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/150/000000/FFFFFF/"
                src={`http://localhost:3030/${user?.profilePicture}`}
              />
            ) : (
              <Image
                borderRadius="full"
                boxSize="150px"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/150/000000/FFFFFF/"
                src={file?.preview}
              />
            )}
          </Box>
          <EmployeeAccountForm />
        </Box>
      </Flex>
    </>
  );
}

export default Account;
