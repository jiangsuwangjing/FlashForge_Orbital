import {
  Box,
  Container,
  Flex,
  Link,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";
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
    <Container maxW="container.lg" py={5}>
      <Box
        bg="white"
        shadow="md"
        borderRadius="md"
        p={5}
        w="full"
        mx="auto"
        mb={5}
      >
        {isLoading ? (
          <ProfileHeaderSkeleton />
        ) : (
          <ProfileInfo userProfile={userProfile} />
        )}
      </Box>
    </Container>
  );
};

export default ProfilePage;

const ProfileHeaderSkeleton = () => {
  return (
    <Flex
      gap={{ base: 4, sm: 10 }}
      py={10}
      direction={{ base: "column", sm: "row" }}
      justifyContent="center"
      alignItems="center"
    >
      <SkeletonCircle size="24" />
      <VStack
        alignItems={{ base: "center", sm: "flex-start" }}
        gap={2}
        mx="auto"
        flex={1}
      >
        <Skeleton height="12px" width="150px" />
        <Skeleton height="12px" width="100px" />
      </VStack>
    </Flex>
  );
};
