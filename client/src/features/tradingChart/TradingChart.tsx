import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateReserves, selectTradingChart } from './tradingChartSlice';

import { Box, Center, Image, useColorModeValue, VStack } from "@chakra-ui/react"

import Chart from "react-apexcharts";

import { formatHour, formatPrice } from '@/utils';

import { getAmountOut } from '@/features/swapInterface/swapInterfaceApi';

import Decimal from 'decimal.js';

import SwitchChartButton from '@/components/TradingChart/SwitchChartButton';

export function TradingChart() {

    const bgColor = useColorModeValue("white", "#171e2b");

    const [assets, setAssets] = useState({ assetInSymbol: 'slp', assetOutSymbol: 'eth' });

    const tradingChartState = useSelector(selectTradingChart);

    const dispatch = useDispatch();

    const handleClickSwitchChartButton = () => {
        var { assetInSymbol, assetOutSymbol } = assets;
        assets.assetOutSymbol = assetInSymbol;
        assets.assetInSymbol = assetOutSymbol;
        setAssets({ ...assets });
    }

    useEffect(() => {

        const eventSource = new EventSource("http://127.0.0.1:4000/charts/reserves/0x306A28279d04a47468ed83d55088d0DCd1369294");

        eventSource.onmessage = (e) => {

            var { updates, token0, token1 } = JSON.parse(e.data);

            var reservesUpdates = updates.map((update: { reserve0: Decimal.Value; reserve1: Decimal.Value; time: number }) =>
            ({
                reserve0: new Decimal(update.reserve0).dividedBy(10 ** Number(token0.decimals)).toString(),
                reserve1: new Decimal(update.reserve1).dividedBy(10 ** Number(token1.decimals)).toString(),
                time: update.time
            }));

            dispatch(updateReserves(reservesUpdates));

        };

        return () => {
            eventSource.close();
        };


    }, []);

    var options = {
        chart: {
            id: "basic-bar",
            toolbar: {
                show: false,
            },
            foreColor: '#373d3f',
            background: bgColor
        },
        xaxis: {
            categories: tradingChartState.reservesUpdates.map(update => formatHour(update.time)),
            labels: {
                show: false,
                style: {
                    colors: "#fff",
                    fontSize: '10px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400,
                    cssClass: 'apexcharts-xaxis-label',
                },
            },
            axisBorder: {
                show: true,
                color: '#78909C',
                height: 1,
                width: '100%',
                offsetX: 0,
                offsetY: 0
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: false,
                style: {
                    colors: "#fff",
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400,
                    cssClass: 'apexcharts-xaxis-label',
                },
            }
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            show: false,
            padding: {
                left: 0,
                right: 0
            }
        },
        tooltip: {
            enabled: true,
            enabledOnSeries: undefined,
            shared: true,
            followCursor: false,
            intersect: false,
            inverseOrder: false,
            custom: undefined,
            fillSeriesColor: false,
            theme: "dark",
            style: {
                fontSize: '12px',
                fontFamily: undefined
            },
            onDatasetHover: {
                highlightDataSeries: false,
            },
            x: {
                show: false,
                formatter: undefined,
            },
            y: {
                formatter: function (value: number) {
                    return formatPrice(value)
                }
            },
            z: {
                formatter: undefined
            },
            marker: {
                show: false,
            },
            items: {
                display: "flex",
            },
            fixed: {
                enabled: false,
                position: 'topRight',
                offsetX: 0,
                offsetY: 0,
            },
        }
    }

    var series = [
        {
            name: "",
            data: tradingChartState.reservesUpdates.map(update =>
                Number(getAmountOut(
                    "1",
                    assets.assetInSymbol == "slp" ? update.reserve0 : update.reserve1,
                    assets.assetInSymbol == "slp" ? update.reserve1 : update.reserve0,
                ))
            )
        }
    ]

    return (
        <VStack spacing={2} borderWidth='1px' borderRadius='lg' padding="1rem" bgColor={bgColor} align='stretch' width={"100%"} >
            <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "left" }} >
                <SwitchChartButton
                    assetInSymbol={assets.assetInSymbol}
                    assetOutSymbol={assets.assetOutSymbol}
                    onClick={handleClickSwitchChartButton}
                />
            </div>
            <Chart
                options={options}
                series={series}
                type="area"
                width="100%"
                height="300px"
            />
        </VStack>
    )
}