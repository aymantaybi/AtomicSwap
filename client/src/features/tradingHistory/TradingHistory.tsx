import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTrades, selectTradingHistory } from './tradingHistorySlice';

import {
    useColorModeValue,
} from "@chakra-ui/react";

import {
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Image,
    Center,
    TableContainer,
    Table
} from "@chakra-ui/react";

import { formatHour } from '@/utils';

interface Trade {
    amountIn: string,
    amountOutMin: string,
    path: Array<string>,
    sender: string,
    transactionHash: string,
    transactionIndex: number,
    blockNumber: number,
    timestamp: number,
    amountOut: string
}

const tokens: { [key: string]: string } = {
    "0x97a9107c1793bc407d6f527b77e7fff4d812bece": "axs",
    "0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5": "eth",
    "0xa8754b9fa15fc18bb59458815510e40a12cd2014": "slp",
    "0x0b7007c13325c48911f73a2dad5fa5dcbf808adc": "usdc-48"
}

function TradeTableRow(props: { trade: Trade; }) {
    const { trade } = props;

    var assetIn = trade.path[0];
    var assetOut = trade.path[trade.path.length - 1];

    return (
        <Tr _hover={{ bg: "teal.600" }} onClick={() => { window.open(`https://explorer.roninchain.com/tx/${trade.transactionHash}`) }}>
            <Td>
                <Center>
                    {trade.amountIn}
                </Center>
            </Td>
            <Td>
                <Center >
                    <Image boxSize='30px' src={`https://assets.axieinfinity.com/explorer/images/contract-icon/${tokens[assetIn]}.png`} />
                </Center>
            </Td>
            <Td>
                <Center>
                    {trade.amountOut}
                </Center>
            </Td>
            <Td>
                <Center >
                    <Image boxSize='30px' src={`https://assets.axieinfinity.com/explorer/images/contract-icon/${tokens[assetOut]}.png`} />
                </Center>
            </Td>
            <Td >
                <Center>
                    {formatHour(trade.timestamp)}
                </Center>
            </Td>
        </Tr>
    )
}

export function TradeHistory() {

    const tradingHistoryState = useSelector(selectTradingHistory);

    const dispatch = useDispatch();

    useEffect(() => {

        const eventSource = new EventSource("http://127.0.0.1:4000/trades/history");

        eventSource.onmessage = (e) => {
            var { swaps } = JSON.parse(e.data);
            dispatch(updateTrades(swaps));
        };

        return () => {
            eventSource.close();
        };

    }, []);

    return (
        <TableContainer bgColor={useColorModeValue("white", "#171e2b")} height="400px" width="100%" overflowY="scroll" borderWidth='1px' borderRadius='lg' padding="1rem">
            <Table variant='simple' size="sm" >
                <Thead position="sticky">
                    <Tr>
                        <Th>Amount In</Th>
                        <Th>Asset In</Th>
                        <Th>Amount Out</Th>
                        <Th>Asset Out</Th>
                        <Th>Time</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {tradingHistoryState.trades.map(trade => (
                        <TradeTableRow trade={trade} />
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    )
}