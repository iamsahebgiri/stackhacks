import React, { useEffect, useState } from "react";
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
  Image,
  createStandaloneToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useStoreActions, useStoreState } from "easy-peasy";
import DashboardShell from "../../components/DashboardShell";
import StoreAccountForm from "../../components/StoreAccountForm";
import { useRouter } from "next/router";

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
    <DashboardShell>
      <Box justifyContent="center" p="6" bg="gray.50">
        <Box mb="12">
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
                <Button>Edit Store Logo</Button>
              </Box>
            )}
          </Flex>
          <Box mt="-100px" ml="50px">
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
        </Box>

        <Stack spacing="4">
          <StoreAccountForm />
          <Flex>
            <Flex width="30%" fontWeight="600">
              Delete account
            </Flex>
            <Box shadow="sm" width="70%" bg="white" rounded="md" p="4">
              <Stack spacing="4">
                <FormControl id="email">
                  <FormLabel>Delete your account</FormLabel>
                  <FormHelperText>
                    Once you delete your account all data associated with it
                    will be lost.
                  </FormHelperText>
                </FormControl>
                <Flex justifyContent="flex-end">
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      axios
                        .delete(
                          "http://localhost:3030/api/users/account/delete",
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                          }
                        )
                        .then((response) => {
                          console.log(response.data);
                          toast({
                            position: "bottom-left",
                            title: "Account deleted successfully.",
                            description:
                              "Your account has been deleted successfully..",
                            status: "success",
                            duration: 9000,
                            isClosable: true,
                          });
                          localStorage.removeItem("token");
                          localStorage.removeItem("user");
                          router.push("/register");
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
                    }}
                  >
                    Delete account
                  </Button>
                </Flex>
              </Stack>
            </Box>
          </Flex>
        </Stack>
      </Box>
    </DashboardShell>
  );
}

export default Account;
