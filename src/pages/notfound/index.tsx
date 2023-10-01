import {
  Center,
  Heading,
  Link,
  VStack
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <Center
      minH='calc(100vh - 80px)'
    >
      <VStack
        gap={4}
      >
        <Heading size='xl'>
          404 Not Found
        </Heading>
        <Heading size='lg'>
          このURLは存在しません
        </Heading>
        <Link
          color='teal.500'
          as={RouterLink}
          to='/'
        >
          <Heading size='md'>
            ホームへ
          </Heading>
        </Link>
      </VStack>
    </Center>
  );
}