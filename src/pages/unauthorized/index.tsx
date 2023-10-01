import {
  Center,
  Heading,
  Link,
  VStack
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export const UnauthorizedPage = () => {
  return (
    <Center
      minH='calc(100vh - 80px)'
    >
      <VStack
        gap={4}
      >
        <Heading size='xl'>
          401 Unauthorized
        </Heading>
        <Heading size='lg'>
          ログインしてください
        </Heading>
        <Link
          color='teal.500'
          as={RouterLink}
          to='/'
        >
          <Heading size='md'>
            ログイン
          </Heading>
        </Link>
      </VStack>
    </Center>
  );
}