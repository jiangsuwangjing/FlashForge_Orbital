import {
  Avatar,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import useAuthStore from "../../store/authStore";
import usePreviewImg from "../../hooks/usePreviewImg";
import useEditProfile from "../../hooks/useEditProfile";
import useShowToast from "../../hooks/useShowToast";

// copied from the chakra ui template

const EditProfile = ({ isOpen, onClose }) => {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
  });
  const authUser = useAuthStore((state) => state.user);
  const fileRef = useRef(null);
  const { handleImageChange, selectedFile, setSelectedFile } = usePreviewImg();
  const { isUpdating, editProfile } = useEditProfile();
  const showToast = useShowToast();

  const handleEditProfile = async () => {
    try {
      await editProfile(inputs, selectedFile);
      setSelectedFile(null);
      onClose();
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg={"white"}
          boxShadow={"xl"}
          border={"1px solid black"}
          ml={1000}
          mt={70}
          // h={"400px"}
          flexDirection={"column"}
          flex={1}
        >
          <ModalHeader />
          <ModalCloseButton position="absolute" top={4} right={4} />
          <ModalBody h={"full"}>
            {/* Container Flex */}
            <Flex bg={"white"}>
              <Stack
                h={"full"}
                spacing={4}
                w={"full"}
                maxW={"md"}
                bg={"#424242"}
                p={6}
                my={0}
                flex={1}
              >
                {/* <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
                  Edit Profile
                </Heading> */}
                <FormControl>
                  <Stack direction={["column", "row"]} spacing={30}>
                    <Center>
                      <img
                        height={"100px"}
                        width={"100px"}
                        src={selectedFile || authUser.profilePicURL}
                        border={"2px solid white "}
                        alt="Profile Pic"
                        className="w-32 h-32 object-cover rounded-full cursor-pointer"
                      />
                    </Center>
                    <Center w="full">
                      <Button w="full" onClick={() => fileRef.current.click()}>
                        Edit Profile Picture
                      </Button>
                    </Center>
                    <Input
                      type="file"
                      hidden
                      ref={fileRef}
                      onChange={handleImageChange}
                    />
                  </Stack>
                </FormControl>

                <FormControl>
                  {/* <FormLabel fontSize={"sm"}>Username</FormLabel> */}
                  <div className="flex flex-row gap-4 items-center">
                    <Input
                      style={{
                        borderRadius: "10px",
                        marginTop: "10px",
                        padding: "10px",
                      }}
                      bg={"black"}
                      color={"white"}
                      placeholder={"Username"}
                      size={"sm"}
                      type={"text"}
                      value={inputs.username || authUser.username}
                      onChange={(e) =>
                        setInputs({ ...inputs, username: e.target.value })
                      }
                    />

                    <Button
                      bg={"blue.400"}
                      color={"white"}
                      size="sm"
                      w="full"
                      _hover={{ bg: "blue.500" }}
                      onClick={handleEditProfile}
                      isLoading={isUpdating}
                      style={{ marginTop: "10px" }}
                    >
                      Submit
                    </Button>
                  </div>
                </FormControl>

                <Stack spacing={6} direction={["column", "row"]}>
                  {/* <Button
                    bg={"red.400"}
                    color={"white"}
                    w="full"
                    size="sm"
                    _hover={{ bg: "red.500" }}
                    onClick={onClose}
                  >
                    Cancel
                  </Button> */}
                  {/* <Button
                    bg={"blue.400"}
                    color={"white"}
                    size="sm"
                    w="full"
                    _hover={{ bg: "blue.500" }}
                    onClick={handleEditProfile}
                    isLoading={isUpdating}
                  >
                    Submit
                  </Button> */}
                </Stack>
              </Stack>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditProfile;
