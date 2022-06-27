import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, VStack, Text } from "@chakra-ui/react";
import MetamaskIcon from "@/icons/Metamask";
import RoninNetworkIcon from "@/icons/RoninNetwork";

export default function ConnectWallet(props: { isOpen: any; onOpen: any; onClose: any }) {

    const { isOpen, onOpen = () => { }, onClose = () => { } } = props
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Connect Wallet</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex width="100%" height="300px" justify="space-evenly" align="center" >
                        <VStack spacing='10px'>
                            <MetamaskIcon boxSize="110px" />
                            <Text fontSize="xl" fontWeight="700" >Metamask</Text>
                        </VStack>
                        <VStack spacing='10px'>
                            <RoninNetworkIcon boxSize="110px" opacity="0.5" />
                            <Text fontSize="xl" fontWeight="700" >Ronin Wallet</Text>
                        </VStack>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}