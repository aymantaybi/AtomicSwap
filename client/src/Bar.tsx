import * as React from "react";
import {
    Image,
    Heading,
    HStack,
    Button,
    Icon,
    Flex,
    Box,
    useColorModeValue
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { ethers } from "ethers";
import SwapIcon from "@/icons/swap";
import BridgeIcon from "@/icons/bridge";
import AtomIcon from "./icons/atom";
import WalletIcon from "./icons/wallet";

function Address(props: any) {

    const { selectedAddress, disconnect } = props;

    return (
        <Button leftIcon={<Image boxSize='22px' src="/metamask.png" />} borderRadius="3xl" color="#171e2b" bgColor="#81E6D9" size='sm' variant='outline' marginRight="1px" _hover={{ bgColor: "#81E6D9", color: "#171e2b" }} onClick={disconnect} >
            {selectedAddress.substring(0, 7)}…{selectedAddress.substring(selectedAddress.length - 6)}
        </Button>
    );
}

export function Bar() {

    const provider = new ethers.providers.Web3Provider(window["ethereum" as any] as any);

    const [selectedAddress, setSelectedAddress] = React.useState<string | null>(null);

    const connect = async () => {

        const accounts = await provider.send("eth_requestAccounts", []);

        var network = await provider.getNetwork();

        console.log(network);

        await provider.send("wallet_addEthereumChain", [{
            chainId: '0x7E4',
            chainName: 'Ronin Network',
            nativeCurrency: {
                name: 'RON',
                symbol: 'RON',
                decimals: 18
            },
            blockExplorerUrls: ['https://explorer.roninchain.com/'],
            rpcUrls: ['https://api.roninchain.com/rpc'],
        }]);

        setSelectedAddress(accounts[0]);
    }

    const disconnect = () => {
        setSelectedAddress(null);
    }

    return (
        <Flex w="100%" h="80px" display="flex" justifyContent="space-between" alignItems="center" >
            <HStack h="100%" spacing='15px' marginLeft="2rem" >
                <AtomIcon color={useColorModeValue("#171e2b", "white")} boxSize="45px" />
                <Heading size="md" color={useColorModeValue("#171e2b", "white")} fontFamily="PT Sans" fontSize="25px" display={["none", "flex"]} flexDirection="row" >
                    Atomic
                    <Heading size="md" fontFamily="PT Sans" fontSize="25px" fontWeight={"90"} >
                        Swap
                    </Heading>
                </Heading>
                <HStack spacing='5px' marginLeft="30px" >
                    <Button size="sm" leftIcon={<SwapIcon boxSize="27px" color="#81E6D9" />} colorScheme='teal' variant='outline'>
                        Swap
                    </Button>
                    <Button size="sm" leftIcon={<BridgeIcon boxSize="27px" color="#81E6D9" />} colorScheme='teal' variant='outline'>
                        Bridge
                    </Button>
                </HStack>
            </HStack>
            <HStack spacing='1rem' marginRight="1rem" >
                {
                    selectedAddress ?
                        <Address {...{ selectedAddress, disconnect }} />
                        :
                        <Button leftIcon={<WalletIcon color />} color="#171e2b" bgColor="#81E6D9" size='sm' variant='outline' marginRight="1px" onClick={connect}>
                            Connect Wallet
                        </Button>
                }
                <ColorModeSwitcher />
            </HStack>
        </Flex >
    )

}