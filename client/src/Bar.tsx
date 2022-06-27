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
import SwapIcon from "@/icons/Swap";
import BridgeIcon from "@/icons/Bridge";
import AtomIcon from "./icons/Atom";
import WalletIcon from "./icons/Wallet";
import ConnectWallet from "./components/Modal/ConnectWallet";
import { useState } from "react";

function Address(props: any) {

    const { selectedAddress, disconnect } = props;

    return (
        <Button leftIcon={<Image boxSize='22px' src="/metamask.png" />} borderRadius="3xl" color="#171e2b" bgColor="#81E6D9" size='sm' variant='outline' marginRight="1px" _hover={{ bgColor: "#81E6D9", color: "#171e2b" }} onClick={disconnect} >
            {selectedAddress.substring(0, 7)}…{selectedAddress.substring(selectedAddress.length - 6)}
        </Button>
    );
}

export function Bar() {

    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    var connect = () => { };
    var disconnect = () => { };

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    if (typeof window.ethereum !== 'undefined') {

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        connect = async () => {

            const accounts = await provider.send("eth_requestAccounts", []);

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

        disconnect = () => {
            setSelectedAddress(null);
        }
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
                    <Button size="sm" leftIcon={<SwapIcon boxSize="27px" color={useColorModeValue("#319795", "#81E6D9")} />} colorScheme='teal' variant='outline'>
                        Swap
                    </Button>
                    <Button size="sm" leftIcon={<BridgeIcon boxSize="27px" color={useColorModeValue("#319795", "#81E6D9")} />} colorScheme='teal' variant='outline'>
                        Bridge
                    </Button>
                </HStack>
            </HStack>
            <HStack spacing='1rem' marginRight="1rem" >
                {
                    selectedAddress ?
                        <Address {...{ selectedAddress, disconnect }} />
                        :
                        <>
                            <Button leftIcon={<WalletIcon boxSize="20px" />} colorScheme='teal' color="#171e2b" size='sm' variant='solid' marginRight="1px" onClick={openModal}>
                                Connect Wallet
                            </Button>
                            <ConnectWallet isOpen={isModalOpen} onOpen={() => { }} onClose={closeModal} />
                        </>

                }
                <ColorModeSwitcher />
            </HStack>
        </Flex >
    )

}