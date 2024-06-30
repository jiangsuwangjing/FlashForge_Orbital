import { Avatar, AvatarGroup, Button, Flex, Text, VStack, useDisclosure, Box } from "@chakra-ui/react";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import EditProfile from "./EditProfile";

const ProfileInfo = () => {
	const { userProfile } = useUserProfileStore();	// get the userProfile information, 
	const authUser = useAuthStore((state) => state.user);	// the current user
	const { isOpen, onOpen, onClose } = useDisclosure();
  console.log(userProfile);
  const profilePicURL = userProfile.profilePicURL;

	return (
		<Flex gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}>
			<AvatarGroup size={{ base: "xl", md: "2xl" }} justifySelf={"center"} alignSelf={"flex-start"} mx={"auto"}>
				<Avatar src={profilePicURL} alt='As a programmer logo' maxWidth="150px" maxHeight="150px"/>
			</AvatarGroup>

			<VStack alignItems={"start"} gap={2} mx={"auto"} flex={1}>
				<Flex
					gap={4}
					direction={{ base: "column", sm: "row" }}
					justifyContent={{ base: "center", sm: "flex-start" }}
					alignItems={"center"}
					w={"full"}
				>
					<Text fontSize={{ base: "sm", md: "lg" }}>{userProfile.username}</Text>
						<Flex gap={4} alignItems={"center"} justifyContent={"center"}>
							<Button
								bg={"white"}
								color={"black"}
								_hover={{ bg: "whiteAlpha.800" }}
								size={{ base: "xs", md: "sm" }}
								onClick={onOpen}
							>
								Edit Profile
							</Button>
						</Flex>
				</Flex>
        {isOpen && (
          <Box position="absolute" zIndex="popover"> {/* zIndex can be a number or a semantic token */}
            <EditProfile isOpen={isOpen} onClose={onClose} />
          </Box>
        )}			
			</VStack>
		</Flex>
	);
};

export default ProfileInfo;
