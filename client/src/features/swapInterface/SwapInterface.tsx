import {
    VStack,
    Image,
    NumberInput,
    NumberInputField,
    IconButton,
    InputGroup,
    InputLeftAddon,
    Button,
    Flex,
    useColorModeValue,
    Heading
} from "@chakra-ui/react"
import { useEffect } from "react";


import { ArrowDownIcon } from '@chakra-ui/icons'

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

import { formatPrice } from '@/utils';

function SwapInput(props: any) {

    const { value, onChange, token } = props;

    const bg = useColorModeValue("gray.200", "gray.700");

    return (
        <VStack spacing={1} justifyContent="center" padding="1rem" borderRadius='lg' bg={bg}  >
            <InputGroup  >
                <InputLeftAddon borderRadius="lg" borderTopRightRadius="lg" borderBottomRightRadius="lg" >
                    <Image boxSize='30px' src={`https://assets.axieinfinity.com/explorer/images/contract-icon/${token}.png`} />
                </InputLeftAddon>
                <NumberInput variant="swap-input" value={value} onChange={onChange}  >
                    <NumberInputField borderLeftRadius={0} textAlign="right" />
                </NumberInput>
            </InputGroup>
            <div style={{ alignSelf: "flex-start", fontSize: 13, fontWeight: 500, display: "flex", flexDirection: "row" }} >
                <div>Balance: 0</div>
                <Button colorScheme='teal' variant='outline' height="20px" width="20px" fontSize="11" marginLeft="0.5rem" >
                    Max
                </Button>
            </div>
        </VStack>
    )

}

export function SwapInterface() {

    const bgColor = useColorModeValue("white", "#171e2b");

    const tradingChartState = useSelector(selectTradingChart);
    const swapInterfaceState = useSelector(selectSwapInterface);

    const dispatch = useDispatch();

    const handleChangeAmount = (amountIn: string) => {

        amountIn = amountIn == "" ? "0" : amountIn;

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
        <VStack spacing={4} alignSelf="center" borderWidth='1px' borderRadius='lg' padding="1rem" width="350px" bgColor={bgColor} >
            <Flex width="100%" justifyContent="space-between" alignItems="center" >
                <Heading size="md" >Swap</Heading>
                <SwapSettings  {...{ settings: swapInterfaceState.settings, handleChangeSlippage, handleChangeDeadline }} />
            </Flex>
            <VStack spacing={5} justifyContent="center" >
                <VStack spacing={5} justifyContent="center" >
                    <SwapInput token="slp" value={swapInterfaceState.amountIn} onChange={(value: string) => handleChangeAmount(value)} />
                    <IconButton icon={<ArrowDownIcon />} aria-label="" />
                    <SwapInput token="eth" value={formatPrice(swapInterfaceState.amountOut)} />
                </VStack>
                <Button colorScheme='teal' size='md' >
                    Swap
                </Button>
            </VStack>
        </VStack >
    )
}