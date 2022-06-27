import {
  ChakraProvider,
  SimpleGrid,
  Flex,
  Grid,
  GridItem
} from "@chakra-ui/react";

import store from '@/app/store';
import { Provider } from 'react-redux';


import { TradeHistory } from "@/features/tradingHistory/TradingHistory";
import { Bar } from './Bar';
import { TradingChart } from "@/features/tradingChart/TradingChart";

import { SwapInterface } from "@/features/swapInterface/SwapInterface";

import { Button, ButtonGroup } from '@chakra-ui/react'

import theme from "./theme/index";

import "./App.css";

export function App() {

  console.log(theme);

  return (
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <div className="flex-container">
          <Bar />
          <Grid
            h="80%"
            padding={["1rem", "2rem"]}
            templateRows='repeat(3, 1fr)'
            templateColumns='repeat(8, 1fr)'
            gap={1}
          >
            <GridItem display={["none", "flex"]} justifyContent="center" alignItems="center" rowSpan={1} colSpan={[8, 8, 5]} padding={[0, "2rem"]} >
              <TradingChart />
            </GridItem>
            <GridItem rowSpan={[3, 1]} colSpan={[8, 8, 3]} display="flex" justifyContent="center" alignItems="center" >
              <SwapInterface />
            </GridItem>
            <GridItem display={["none", "flex"]} justifyContent="center" alignItems="center" rowSpan={1} colSpan={8} padding={[0, "3rem"]} >
              <TradeHistory />
            </GridItem>
          </Grid>
          {/*  */}
        </div>
      </Provider>
    </ChakraProvider >

  )
}