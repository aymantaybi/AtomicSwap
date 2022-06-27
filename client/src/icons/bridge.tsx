import { Icon } from "@chakra-ui/react";

export default function BridgeIcon(props: any) {

	const { color } = props

	return (
		< Icon viewBox="0 0 48 48" fill={"none"} {...props}>
			<path stroke={color} d="M8 13C8 13 14 23 24 23C34 23 40 13 40 13" stroke-width="4" />
			<path stroke={color} d="M8 10V38" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
			<path stroke={color} d="M40 10V38" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
			<path stroke={color} d="M4 30.5C4 30.5 16.1877 29.9026 24 30C31.8196 30.0975 44 31 44 31" stroke-width="4" stroke-linecap="round" />
			<path stroke={color} d="M16 21V30" stroke-width="4" stroke-linecap="round" />
			<path stroke={color} d="M24 23L24 30" stroke-width="4" stroke-linecap="round" />
			<path stroke={color} d="M32 21L32 30" stroke-width="4" stroke-linecap="round" />
			<path stroke={color} d="M8 13L4 18" stroke-width="4" stroke-linecap="round" />
			<path stroke={color} d="M44 18L40 13" stroke-width="4" stroke-linecap="round" />
		</Icon >
	)
}
