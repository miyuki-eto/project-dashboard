import React from "react";
import { formatCurrency } from "./functions/format";
import EChart from "./charts/eChart";

export default function WatchlistCard({data}) {

    const chart_options = {
        color: [
            '#e8c2ca',
            'rgba(199,144,186,0.36)',
            '#509a9a',
            '#d48265',
            '#91c7ae',
            '#e8c2ca',
            '#ca8622',
            '#bda29a',
            '#6e7074',
            '#546570',
            '#21dff6'
        ],
        grid: {top: 0, right: 15, bottom: 0, left: 0},
        animationEasing: 'quadraticInOut',
        animationEasingUpdate: 'quadraticInOut',
        animationDuration: 2000,
        xAxis: {
            type: "category",
            data: data.sparkline_in_7d.price,
            show: false
        },
        yAxis: [
            {
                name: "price",
                type: "value",
                scale: true,
                splitLine: {
                    show: false
                },
                show: false
            }
        ],
        series: [
            {
                data: data.sparkline_in_7d.price,
                name: "price",
                type: "line",
                smooth: true,
                yAxisIndex: 0,
                symbolSize: 0,
                lineStyle: {
                    width: 1
                }
            }]
    };

    return (
        <div
            className="items-center text-center justify-center content-center w-full">
            <EChart
                options={chart_options}
                height={'125px'}
            />
            <div className={"flex flex-row gap-3 text-center justify-center content-center items-center mt-1 w-full"}>
                <img src={data.image} alt="logo" className="w-6"/>
                <p className={"text-xl"}>{data.symbol}</p>
            </div>

            <div
                className="flex flex-row gap-2 text-sm mx-2 px-2 items-center text-center justify-center content-center mb-1 w-full">
                <p className="text-xl">{formatCurrency(data.current_price)}</p>
                <p className={data.price_change_percentage_24h != null ? (data.price_change_percentage_24h > 0 ? " text-green-500 " : " text-red-500 ") + " " : '-'}>
                    {data.price_change_percentage_24h != null ? data.price_change_percentage_24h.toFixed(2) + "%" : '-'}
                </p>
            </div>

        </div>
    );
}