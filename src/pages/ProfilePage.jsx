import { Container, Flex, Link, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react";
import useGetUserProfileByUsername from "../hooks/useGetUserProfileByUsername";
import { Link as RouterLink } from "react-router-dom";
import ProfileInfo from "../components/profile/ProfileInfo";
import useAuthStore from "../store/authStore";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
	let username;
	if (user) username = user.username;
	const { isLoading, userProfile } = useGetUserProfileByUsername(username);

	return (
		<Container maxW='container.lg' py={5}>
			<Flex py={10} px={4} pl={{ base: 4, md: 10 }} w={"full"} mx={"auto"} flexDirection={"column"}>
      {!isLoading && userProfile && <ProfileInfo />}
      {/* {isLoading && <ProfileHeaderSkeleton />} */}
			</Flex>
			<Flex
				px={{ base: 2, sm: 4 }}
				maxW={"full"}
				mx={"auto"}
				borderTop={"1px solid"}
				borderColor={"whiteAlpha.300"}
				direction={"column"}
			>
			</Flex>
		</Container>
	);
};

export default ProfilePage;

// skeleton for profile header
const ProfileHeaderSkeleton = () => {
	return (
		<Flex
			gap={{ base: 4, sm: 10 }}
			py={10}
			direction={{ base: "column", sm: "row" }}
			justifyContent={"center"}
			alignItems={"center"}
		>
			<SkeletonCircle size='24' />

			<VStack alignItems={{ base: "center", sm: "flex-start" }} gap={2} mx={"auto"} flex={1}>
				<Skeleton height='12px' width='150px' />
				<Skeleton height='12px' width='100px' />
			</VStack>
		</Flex>
	);
};