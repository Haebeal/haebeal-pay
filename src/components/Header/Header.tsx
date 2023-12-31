import {
  Avatar,
  Container,
  Heading,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Spacer,
  useMediaQuery,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/utils";
import { Navigator } from "@/components/Navigator";

export const Header = () => {
  const location = useLocation();
  const { signout, currentUser } = useAuth();
  const [isMobile] = useMediaQuery(`(max-width: 48em)`);

  return (
    <Container h="100%" maxW="container.xl">
      <HStack h="100%" spacing={10} py={4} pe={5}>
        {isMobile ? (
          <Navigator />
        ) : (
          <>
            <Spacer />
            {routes.map((route) => (
              <Link
                key={route.path}
                color={route.path === location.pathname ? "" : "gray"}
                as={RouterLink}
                to={route.path}
              >
                <HStack>
                  <Heading size="sm">{route.title}</Heading>
                </HStack>
              </Link>
            ))}
          </>
        )}
        <Spacer />
        <Menu>
          <MenuButton>
            <Avatar
              h={10}
              w={10}
              borderWidth={1}
              borderColor="gray.100"
              src={currentUser?.photoURL ?? ""}
            />
          </MenuButton>
          <MenuList>
            <MenuGroup title={currentUser?.displayName ?? "未ログイン"}>
              {currentUser && (
                <>
                  <MenuItem as={RouterLink} to="/account">
                    アカウント
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/profile">
                    プロフィール
                  </MenuItem>
                  <MenuItem onClick={signout}>ログアウト</MenuItem>
                </>
              )}
            </MenuGroup>
          </MenuList>
        </Menu>
      </HStack>
    </Container>
  );
};
