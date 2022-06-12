import {
    Box,
    HStack,
    VStack,
    Image,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    IconButton,
    InputGroup,
    InputLeftAddon,
    Button,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Center,
    Flex,
    useColorModeValue
} from "@chakra-ui/react"
import { useEffect } from "react";

import { formatPrice } from '@/utils';

import { ArrowForwardIcon, SettingsIcon } from '@chakra-ui/icons'

import { useSelector, useDispatch, batch } from 'react-redux';

import { getAmountOut } from '@/features/swapInterface/swapInterfaceApi';

import { selectTradingChart } from '@/features/tradingChart/tradingChartSlice';

import {
    setAmountIn,
    setAmountOut,
    setAmountOutMin,
    selectSwapInterface,
    setSlippage,
    setDeadline
} from '@/features/swapInterface/swapInterfaceSlice';
import SwapSettings from "@/components/SwapInterface/SwapSettings";


export function TradingInterface() {

    const bgColor = useColorModeValue("white", "#171e2b");

    const tradingChartState = useSelector(selectTradingChart);
    const swapInterfaceState = useSelector(selectSwapInterface);

    const dispatch = useDispatch();

    const handleChangeAmount = (amountIn: string) => {

        var lastReservesUpdate = tradingChartState.reservesUpdates[tradingChartState.reservesUpdates.length - 1];

        var reserveIn = lastReservesUpdate.reserve0;
        var reserveOut = lastReservesUpdate.reserve1;

        var amountOut = getAmountOut(amountIn, reserveIn, reserveOut);

        batch(() => {
            dispatch(setAmountIn(amountIn));
            dispatch(setAmountOut(amountOut.toString()));
            dispatch(setAmountOutMin(amountOut.times("0.995").toString()));
        });
    }

    useEffect(() => {

        if (swapInterfaceState.amountIn != "0") {
            handleChangeAmount(swapInterfaceState.amountIn);
        }

    }, [tradingChartState])

    const handleChangeSlippage = (auto: boolean, tolerance: number) => {
        dispatch(setSlippage({ auto, value: tolerance }));
    }

    const handleChangeDeadline = (deadline: number) => {
        dispatch(setDeadline(deadline));
    }

    return (
        <Center borderWidth='1px' borderRadius='lg' padding="1rem" bgColor={bgColor} h="30%" flexDirection={"column"} >
            <Flex width="100%" justifyContent="right" >
                <SwapSettings
                
                    settings={swapInterfaceState.settings}

                    {...{
                        handleChangeSlippage,
                        handleChangeDeadline
                    }}

                />
            </Flex>
            <Tabs variant='soft-rounded' colorScheme='green'>
                <TabList>
                    <Tab>Market</Tab>
                    <Tab>Limit</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <VStack spacing={2} justifyContent="center" >
                            <HStack spacing={2} justifyContent="center" >
                                <InputGroup>
                                    <InputLeftAddon>
                                        <Image boxSize='30px' src={`https://assets.axieinfinity.com/explorer/images/contract-icon/slp.png`} />
                                    </InputLeftAddon>
                                    <NumberInput w="100%" value={swapInterfaceState.amountIn} onChange={(value) => handleChangeAmount(value)}>
                                        <NumberInputField borderLeftRadius={0} />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </InputGroup>
                                <IconButton icon={<ArrowForwardIcon />} aria-label="" />
                                <InputGroup>
                                    <InputLeftAddon>
                                        <Image boxSize='30px' src={`https://assets.axieinfinity.com/explorer/images/contract-icon/eth.png`} />
                                    </InputLeftAddon>
                                    <NumberInput w="100%" isReadOnly value={formatPrice(swapInterfaceState.amountOut)} >
                                        <NumberInputField borderLeftRadius={0} />
                                    </NumberInput>
                                </InputGroup>
                            </HStack>
                            <Button colorScheme='teal' size='md' >
                                Swap
                            </Button>
                        </VStack>
                    </TabPanel>
                    <TabPanel>
                        <p>two!</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Center >
    )
}