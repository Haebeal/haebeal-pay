import { ChakraProvider, CircularProgress } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { customTheme } from "./utils/theme";
import { router } from "./utils/router";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <ChakraProvider theme={customTheme}>
        <React.Suspense
          fallback={<CircularProgress isIndeterminate color="twitter.500" />}
        >
          <RouterProvider router={router} />
        </React.Suspense>
      </ChakraProvider>
    </RecoilRoot>
  </React.StrictMode>
);
