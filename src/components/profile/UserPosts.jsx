import { Box, VStack, Text } from "@chakra-ui/react";

const UserPosts = ({ posts }) => {
  return (
    <VStack spacing={4} align="stretch">
      {posts.map((post) => (
        <Box key={post.id} p={5} shadow="md" borderWidth="1px">
          <Text mt={4}>{post.content}</Text>
        </Box>
      ))}
    </VStack>
  );
};

export default UserPosts;
