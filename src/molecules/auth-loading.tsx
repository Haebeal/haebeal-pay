import { Center, Heading, VStack } from "@chakra-ui/react";
import { LoadingAnimaton } from "../atoms/loading-animation";

export const AuthLoading = () => {
  return (
    <Center h="100vh">
      <VStack gap={2}>
        <LoadingAnimaton />
        <Heading size="sm">読み込み中...</Heading>
      </VStack>
    </Center>
  );
};
