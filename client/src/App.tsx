import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Image,
  Heading,
  HStack,
  SimpleGrid
} from "@chakra-ui/react";

import store from '@/app/store';
import { Provider } from 'react-redux';

import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";

import { TradeHistory } from "@/features/tradingHistory/TradingHistory";
import { Bar } from './Bar';
import { TradingChart } from "@/features/tradingChart/TradingChart";

import Chart from "react-apexcharts";
import { TradingInterface } from "@/features/swapInterface/SwapInterface";

export function App() {

  return (
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <Box textAlign="center" fontSize="xl" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Bar />
          <SimpleGrid columns={[1, null, 2]} spacing={1} w="90vw" h="90vh" alignItems="center" >
            <TradeHistory />
            <VStack spacing={2} alignItems="center" justifyContent="center" height={"100%"} >
              <TradingChart />
              <TradingInterface />
            </VStack>
          </SimpleGrid>
        </Box>
      </Provider>
    </ChakraProvider>
  )
}
