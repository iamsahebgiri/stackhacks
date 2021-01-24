import { StoreProvider } from "easy-peasy";
import store from "../store";

import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";

import theme from "../theme";

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider store={store}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </StoreProvider>
  );
}

export default MyApp;
