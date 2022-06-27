import { Button, ButtonGroup, Image } from "@chakra-ui/react"

export default function SwitchChartButton(props: any) {

    const { assetInSymbol, assetOutSymbol, onClick } = props;

    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "left", margin: "1rem" }}>
            <div style={{
                height: "56px",
                position: "relative",
                display: "flex",
                flexDirection: "row",
                marginRight: "22.6667px",
                bottom: "15px"
            }}
                onClick={onClick}
            >
                <div style={{
                    zIndex: 2,
                    backgroundColor: "rgb(195, 227, 213,0.9)",
                    borderRadius: "50%",
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }} >
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }} >
                        <Image width={"29.33px"} height={"29.33px"} src={`https://assets.axieinfinity.com/explorer/images/contract-icon/${assetInSymbol}.png`} />
                    </div>
                </div>
                <div style={{
                    position: "absolute",
                    left: "29.3333px",
                    top: "18.6667px",
                    backgroundColor: "lightgray",
                    borderRadius: "50%",
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }} >
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }} >
                        <Image width={"29.33px"} height={"29.33px"} src={`https://assets.axieinfinity.com/explorer/images/contract-icon/${assetOutSymbol}.png`} />
                    </div>
                </div>
            </ div >
        </div>
    )

}