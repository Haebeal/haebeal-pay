import {
  Center,
  ChakraProvider,
  CircularProgress,
  Heading,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { customTheme } from "./utils/theme";
import { router } from "./utils/router";
import { connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator } from "firebase/firestore";
import { connectFunctionsEmulator } from "firebase/functions";
import { auth, firestore, functions } from "./utils";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

if (location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <ChakraProvider theme={customTheme}>
        <React.Suspense
          fallback={
            <Center h="100vh">
              <VStack gap={2}>
                <CircularProgress isIndeterminate color="twitter.500" />
                <Heading size="sm">読み込み中...</Heading>
              </VStack>
            </Center>
          }
        >
          <RouterProvider router={router} />
        </React.Suspense>
      </ChakraProvider>
    </RecoilRoot>
  </React.StrictMode>
);
