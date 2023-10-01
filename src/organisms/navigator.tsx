import {
  Button,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  IconButton,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { MdMenu } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { routes } from "../utils/routes";

export const Navigator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonRef = useRef(null);
  const { currentUser } = useAuth();

  return (
    <>
      <IconButton
        ref={buttonRef}
        colorScheme="gray"
        aria-label="menu"
        onClick={onOpen}
        icon={<MdMenu />}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={buttonRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>メニュー</DrawerHeader>
          <VStack mt={5} gap={5}>
            {currentUser ? (
              routes.map((route, ind) => (
                <Button
                  key={ind}
                  w="80%"
                  colorScheme={
                    route.path === `/${location.pathname.split("/")[1]}`
                      ? "twitter"
                      : "gray"
                  }
                  onClick={() => {
                    navigate(route.path);
                    onClose();
                  }}
                >
                  {route.title}
                </Button>
              ))
            ) : (
              <Heading size="sm">ログインしてください</Heading>
            )}
          </VStack>
        </DrawerContent>
      </Drawer>
    </>
  );
};
