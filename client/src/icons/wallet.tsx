import { Icon } from "@chakra-ui/react";

export default function WalletIcon(props: any) {

    const { color } = props

    return (
        <Icon viewBox='0 0 24 24' {...props}>
            <path fill={color} d='M15.45 1.403A2 2 0 0118 3.326V5h2a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2h.027A2 2 0 012 18.674V6.754a2 2 0 011.45-1.923l12-3.428zM10.14 19H20v-8h-2v4.246a2 2 0 01-1.45 1.923L10.14 19zM20 7v2h-2V7h2zM4 6.754v11.92l12-3.428V3.326L4 6.754zM14 9a1 1 0 11-2 0 1 1 0 012 0z' />
        </Icon>
    )
}
