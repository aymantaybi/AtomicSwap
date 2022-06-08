import * as React from "react";
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
    SimpleGrid,
    Button,
    Icon
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { ethers } from "ethers";

const CircleIcon = (props: any) => (
    <Icon viewBox='0 0 24 24' {...props}>
        <path
            fill='#81E6D9'
            d='M15.45 1.403A2 2 0 0118 3.326V5h2a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2h.027A2 2 0 012 18.674V6.754a2 2 0 011.45-1.923l12-3.428zM10.14 19H20v-8h-2v4.246a2 2 0 01-1.45 1.923L10.14 19zM20 7v2h-2V7h2zM4 6.754v11.92l12-3.428V3.326L4 6.754zM14 9a1 1 0 11-2 0 1 1 0 012 0z'
        />
    </Icon>
);

function Address(props: any) {

    const { selectedAddress } = props;

    return (
        <Button leftIcon={<Image boxSize='22px' src="/metamask.png" />} borderRadius="3xl" bgColor="#171e2b" color="#81E6D9" size='sm' variant='outline' marginRight="10" _hover={{ bgColor: "#81E6D9", color: "#171e2b" }} >
            {selectedAddress.substring(0, 7)}…{selectedAddress.substring(selectedAddress.length - 6)}
        </Button>
    );
}


export function Bar() {

    const [selectedAddress, setSelectedAddress] = React.useState<string | null>(null);

    const connectToMetamask = async () => {

        const provider = new ethers.providers.Web3Provider(window["ethereum" as any] as any);
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


    return (
        <Box bg='#81E6D9' w='100%' p={1} color='white' display="flex" justifyContent="space-between" alignItems="center" boxShadow="0px 1px 0px 0px #1A202C" >
            <HStack spacing='15px' marginLeft="1rem" >
                <Image boxSize="45px" src="atom_logo.png" />
                <Heading size="md" color="#1A202C" fontFamily="PT Sans" fontSize="25px" display="flex" flexDirection="row" >
                    Atomic
                    <Heading size="md" color="#1A202C" fontFamily="PT Sans" fontSize="25px" fontWeight={"90"} >
                        Swap
                    </Heading>
                </Heading>
            </HStack>

            <HStack spacing='1rem' marginLeft="1rem" >
                {
                    selectedAddress ?
                        <Address {...{ selectedAddress }} />
                        :
                        <Button leftIcon={<CircleIcon />} bgColor="#171e2b" color="#81E6D9" size='sm' variant='outline' _hover={{ bgColor: "#171e2b" }} marginRight="10" onClick={connectToMetamask}>
                            Connect Wallet
                        </Button>
                }
                <ColorModeSwitcher />
            </HStack>
        </Box>
    )

}