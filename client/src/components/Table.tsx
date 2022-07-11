import { VStack, HStack, Center, useColorModeValue, StackDivider } from "@chakra-ui/react";

function Table(props: { children: any; }) {

    const { children } = props;

    console.log(children);

    return (
        <VStack width="100%" height="100%" spacing={2} align='stretch' {...props} >
            {children.map((child: any) => (child))}
        </VStack>
    )
}

function TableHead(props: { children: any; }) {

    const { children } = props;

    return (
        <HStack width="100%" height="30px" background={useColorModeValue("rgba(129, 230, 217,0.35)", "rgba(129, 230, 217,0.15)")} align='stretch' borderRadius='xl' color={useColorModeValue("gray.800", "gray.200")} {...props} >
            {children.map((child: any) => (child))}
        </HStack>
    )
}

function TableBody(props: { children: any; }) {

    const { children } = props;

    return (
        <VStack width="100%" height="100%" spacing={0} align='stretch' divider={<StackDivider borderColor='gray.100' w="95%" alignSelf="center" />} {...props} >
            {Array.isArray(children) ?
                children.map((child: any) => (child))
                :
                children
            }
        </VStack>
    )

}


function TableRow(props: { children: any; }) {

    const { children } = props;

    return (
        <HStack width="100%" height="50px" spacing={1} align='stretch' _hover={{ background: "rgba(255,255,255,0.05)" }} {...props} >
            {children.map((child: any) => (child))}
        </HStack>
    )

}

function TableCell(props: { children: any; }) {

    const { children } = props;

    return (
        <Center width="100%" height="100%" {...props} >
            {children}
        </Center>
    )
}

export default Table;

export { TableBody, TableHead, TableRow, TableCell };