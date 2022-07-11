import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, VStack, Text, Link } from "@chakra-ui/react";
import MetamaskIcon from "@/icons/Metamask";
import RoninNetworkIcon from "@/icons/RoninNetwork";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";

export default function ConnectWallet(props: { isOpen: any; onOpen: any; onClose: any }) {

    const { isOpen, onOpen = () => { }, onClose = () => { } } = props;

    var connect = () => { };
    var disconnect = () => { };

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

           // setSelectedAddress(accounts[0]);
        }

        disconnect = () => {
           // setSelectedAddress(null);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Connect Wallet</ModalHeader>
                <ModalCloseButton />
                <ModalBody display="flex" flexDirection="column" justifyContent="space-around" alignItems="center"  >
                    <Flex width="100%" height="300px" justify="space-evenly" align="center" >
                        <VStack spacing='10px'>
                            <MetamaskIcon boxSize="100px" />
                            <Text fontSize="xl" fontWeight="700" >Metamask</Text>
                        </VStack>
                        <VStack spacing='10px' cursor="not-allowed" >
                            <RoninNetworkIcon boxSize="100px" opacity="0.5" />
                            <Text fontSize="xl" fontWeight="700" >Ronin Wallet</Text>
                        </VStack>
                    </Flex>
                    <Link color='teal.500' href='https://cookbook.axie.live/developers-cookbook/user-authorization#metamask-connected-to-ronin-chain.' isExternal>
                        MetaMask connected to Ronin chain <ExternalLinkIcon mx='2px' />
                    </Link>
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}