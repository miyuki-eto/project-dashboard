import React from "react";
import EChart from "./charts/eChart";

import TimeframeButton from "./subcomponents/timeframeButton";
import TokenPrice from "./subcomponents/tokenPrice";
import SupplyList from "./subcomponents/supplyList";
import MarketCapList from "./subcomponents/marketCapList";
import DenomButton from "./subcomponents/denomButton";

import {ThemeContext} from "./structure/themeContext";

export default function TokenCard({data, chartData, timeframe, loadingChart, loadingInfo, setTimeframe, denom, setDenom}) {

    const timeframes = ["24h", "7d", "30d", "90d", "365d"];
    const denominations = ["usd", "eth"];

    const { theme } = React.useContext(ThemeContext);
    const colorBg = (theme === 'light') ? '#ffffff' : '#161b22';
    const colorText = (theme === 'light') ? '#757575' : '#e0e0e0';
    const colorInactive = (theme === 'light') ? '#e0e0e0' : '#424242';

    const chart_options = {
        color: [
            '#e8c2ca',
            '#735d78',
            '#6ac8b9',
            '#d48265',
            '#91c7ae',
            '#e8c2ca',
            '#ca8622',
            '#bda29a',
            '#6e7074',
            '#546570',
            '#21dff6'
        ],
        grid: {top: 8, right: 160, bottom: 24, left: 0},
        legend: {
            data: ['price', 'market cap', 'tvl'],
            icon: 'rect',
            textStyle: {color: colorText},
            inactiveColor: colorInactive
        },
        animationEasing: 'quadraticInOut',
        animationEasingUpdate: 'quadraticInOut',
        animationDuration: 2000,
        xAxis: {
            type: "time",
            data: chartData[0],
            axisLabel: {
                formatter: '{MM}-{dd}'
            }
        },
        yAxis: [
            {
                name: "price",
                type: "value",
                scale: true,
                splitLine: {
                    show: false
                },
                position: "right",
                axisLabel: {
                    formatter: '${value}',
                    show: true,
                    position: 'inside'
                }
            },
            {
                name: "market cap",
                type: "value",
                scale: true,
                position: "right",
                offset: 60,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: function (value, index) {
                        if (value > 1000000000000) {
                            return '$' + value / 1000000000000 + "t"
                        } else if (value > 1000000000) {
                            return '$' + value / 1000000000 + "b"
                        } else if (value > 1000000) {
                            return '$' + value / 1000000 + "m"
                        }
                    },
                    show: true,
                    position: 'inside'
                }
            },
            {
                name: "tvl",
                type: "value",
                scale: true,
                position: "right",
                offset: 110,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: function (value, index) {
                        if (value > 1000000000000) {
                            return '$' + value / 1000000000000 + "t"
                        } else if (value > 1000000000) {
                            return '$' + value / 1000000000 + "b"
                        } else if (value > 1000000) {
                            return '$' + value / 1000000 + "m"
                        }
                    },
                    show: true,
                    position: 'inside'
                }
            },
        ],
        series: [
            {
                data: chartData[1],
                name: "price",
                type: "line",
                smooth: true,
                yAxisIndex: 0,
                symbolSize: 0,
                lineStyle: {
                    width: 1
                },
                // label: {
                //     normal: {
                //         formatter: function (params) {
                //             var val = format(params.price);
                //             return val;
                //         },
                //         show: true,
                //         position: 'inside'
                //     },
                // }
            },
            {
                data: chartData[2],
                type: "line",
                name: "market cap",
                smooth: true,
                yAxisIndex: 1,
                symbolSize: 0,
                lineStyle: {
                    width: 1
                }
            },
            {
                data: chartData[3],
                type: "line",
                name: "tvl",
                smooth: true,
                connectNulls: true,
                yAxisIndex: 2,
                symbolSize: 0,
                lineStyle: {
                    width: 1
                }
            }]
    };

    return (
        <>
            <div
                className={(loadingInfo ? " hidden " : "  ") + "flex flex-col content-center items-center justify-center w-full h-full gap-2 px-4 pb-4 pl-4 pr-4"}>
                <div className="flex flex-row w-full gap-1 content-center items-center justify-center px-8">
                    <TokenPrice data={data}/>
                    <SupplyList data={data}/>
                    <MarketCapList data={data}/>
                </div>
                <div className={"flex flex-for w-full justify-between px-12"}>
                    <div><p className={"hidden"}>hidden</p></div>
                    <div className="flex flex-row gap-2 ">
                        {timeframes.map((time, index) => (
                            <TimeframeButton key={index} timeframe={time} global={timeframe}
                                             setTimeframe={setTimeframe}/>
                        ))
                        }
                    </div>
                    <div className="flex flex-row gap-2">
                        {denominations.map((d, index) => (
                            <DenomButton key={index} denom={d} global={denom}
                                             setDenom={setDenom}/>
                        ))
                        }
                    </div>

                </div>
                <div className={(loadingChart ? " hidden " : "  ") + "w-full mt-4"}>
                    <EChart
                        options={chart_options}
                        height={'530px'}
                    />
                </div>
                <div
                    className={(loadingChart ? "  " : " hidden ") + "w-full h-full mx-auto my-auto items-center content-center justify-center text-center"}>
                    <p>loading...</p>
                </div>
            </div>
            <div
                className={(loadingInfo ? "  " : " hidden ") + "w-full mx-auto my-auto h-full items-center content-center justify-center text-center"}>
                <p>loading...</p>
            </div>
        </>
    );
}