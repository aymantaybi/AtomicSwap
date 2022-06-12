import { SettingsIcon } from "@chakra-ui/icons";
import { Popover, PopoverTrigger, Button, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, IconButton, Box, VStack, HStack, FormControl, FormLabel, Switch, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Heading } from "@chakra-ui/react";
import { useState } from "react";

function SettingWrapper(props: any) {

    const { title, children } = props;

    return (
        <VStack spacing={3} align='stretch'>
            <Heading fontSize={"sm"} textAlign="start" >{title}</Heading>
            {children}
        </VStack>
    )
}

function SlippageTolerance() {

    const format = (val: number) => `${val} %`;
    const parse = (val: string) => val.replace(/^\%/, '');

    const [toleranceRatio, setToleranceRatio] = useState<number>(0.5);
    const [auto, setAuto] = useState<boolean>(true);

    return (
        <SettingWrapper title="Slippage Tolerance" >
            <HStack spacing={2} justifyContent='space-between' >
                <NumberInput
                    minWidth="100px"
                    maxWidth="150px"
                    size='sm'
                    value={format(toleranceRatio)}
                    onChange={(value) => setToleranceRatio(Number(parse(value)))}
                    step={0.1}
                >
                    <NumberInputField borderRadius="lg" placeholder="0.5 %" disabled={auto} />
                </NumberInput>
                <FormControl display='flex' alignItems='center' >
                    <Switch
                        id='auto'
                        size="sm"
                        onChange={(event) => { setToleranceRatio(0.5); setAuto(event.target.checked) }}
                    />
                    <FormLabel htmlFor='auto-slippage' mb='0' margin="5px" >
                        Auto
                    </FormLabel>
                </FormControl>
            </HStack>
        </SettingWrapper>
    )

}

function TransactionDeadline() {

    const [deadline, setDeadline] = useState<number>(30);

    return (
        <SettingWrapper title="Transaction Deadline" >
            <HStack spacing={2} justifyContent='space-between' >
                <NumberInput
                    minWidth="100px"
                    maxWidth="150px"
                    size='sm'
                    value={deadline}
                    onChange={(value) => setDeadline(Number(value))}
                >
                    <NumberInputField borderRadius="lg" />
                </NumberInput>
                <Heading fontSize={"sm"} textAlign="start" >
                    Minutes
                </Heading>
            </HStack>
        </SettingWrapper>
    )

}

export default function SwapSettings() {


    return (
        <Popover placement='left' >
            <PopoverTrigger>
                <IconButton size="sm" aria-label="Settings" icon={<SettingsIcon />} marginTop="1rem" />
            </PopoverTrigger>
            <PopoverContent width={"min-content"} >
                <PopoverCloseButton />
                <PopoverHeader fontSize={"md"} textAlign="start" >Settings</PopoverHeader>
                <PopoverBody paddingBottom="20px" >
                    <VStack spacing={3} align='stretch'>
                        <SlippageTolerance />
                        <TransactionDeadline />
                    </VStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )

}