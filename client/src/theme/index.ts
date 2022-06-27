// theme.ts (tsx file with usage of StyleFunctions, see 4.)
import { extendTheme } from '@chakra-ui/react'
import { StyleFunctionProps } from '@chakra-ui/theme-tools'

const theme = extendTheme({
    config: {
        useSystemColorMode: false,
        initialColorMode: "dark"
    },
    components: {
        NumberInput: {
            variants: {
                "swap-input": (props: StyleFunctionProps) => ({
                    field: {
                        border: '0',
                        bgColor: props.colorMode === 'dark' ? "gray.700" : "gray.200",
                        fontWeight: 700
                    }
                })
            }
        },
    },
})

export default theme