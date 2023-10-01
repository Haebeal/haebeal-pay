import {
  extendTheme,
  StyleFunctionProps
} from "@chakra-ui/react";

export const customTheme = extendTheme({
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        backgroundColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.100'
      }
    })
  }
});