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

function SlippageTolerance(props: { slippage: any; handleChangeSlippage: any; }) {

    const { slippage, handleChangeSlippage } = props;

    const format = (val: number) => `${val} %`;
    const parse = (val: string) => val.replace(/^\%/, '');
    
    return (
        <SettingWrapper title="Slippage Tolerance" >
            <HStack spacing={2} justifyContent='space-between' >
                <NumberInput
                    minWidth="100px"
                    maxWidth="150px"
                    size='sm'
                    value={format(slippage.value)}
                    onChange={(value) => handleChangeSlippage(slippage.auto, Number(parse(value)))}
                    step={0.1}
                >
                    <NumberInputField borderRadius="lg" placeholder="0.5 %" disabled={slippage.auto} />
                </NumberInput>
                <FormControl display='flex' alignItems='center' >
                    <Switch
                        id='auto'
                        size="sm"
                        isChecked={slippage.auto}
                        onChange={(event) => handleChangeSlippage(event.target.checked, 0.5)}
                    />
                    <FormLabel htmlFor='auto-slippage' mb='0' margin="5px" >
                        Auto
                    </FormLabel>
                </FormControl>
            </HStack>
        </SettingWrapper>
    )

}

function TransactionDeadline(props: { deadline: any; handleChangeDeadline: any; }) {

    const { deadline, handleChangeDeadline } = props;

    return (
        <SettingWrapper title="Transaction Deadline" >
            <HStack spacing={2} justifyContent='space-between' >
                <NumberInput
                    minWidth="100px"
                    maxWidth="150px"
                    size='sm'
                    value={deadline}
                    onChange={(value) => handleChangeDeadline(Number(value))}
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

export default function SwapSettings(props: { settings: any; handleChangeSlippage: any; handleChangeDeadline: any; }) {

    const { settings, handleChangeSlippage, handleChangeDeadline } = props;

    const { slippage, deadline } = settings;

    return (
        <Popover placement='left' >
            <PopoverTrigger>
                <IconButton size="sm" aria-label="Settings" icon={<SettingsIcon />} marginTop="1rem" />
            </PopoverTrigger>
            <PopoverContent width={"min-content"} >
                <PopoverCloseButton />
                <PopoverHeader fontSize={"md"} textAlign="start" >Swap Settings</PopoverHeader>
                <PopoverBody paddingBottom="20px" >
                    <VStack spacing={3} align='stretch'>
                        <SlippageTolerance {...{ slippage, handleChangeSlippage }} />
                        <TransactionDeadline   {...{ deadline, handleChangeDeadline }} />
                    </VStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )

}