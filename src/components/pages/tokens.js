import React, {useEffect, useState} from "react";
import TokenCard from "../../components/tokenCard";
import WatchlistCard from "../watchlistCard";

import {ReactSearchAutocomplete} from 'react-search-autocomplete'
import axios from "axios";
import axiosThrottle from 'axios-request-throttle';

import {AiFillStar, AiOutlineStar} from 'react-icons/ai';
import {MdShowChart} from 'react-icons/md';
import {CgNotes} from "react-icons/all";
import {AiOutlinePlus, AiOutlineMinus} from "react-icons/all";

import {addWatchlist, removeWatchlist} from "../functions/watchlist";
import {useDidMountEffect, useInterval} from "../functions/useInterval";
import {getChartData, getCurrentData, getTokenList, getWatchlistData } from "../functions/api";

axiosThrottle.use(axios, {requestsPerSecond: 10});

export default function Tokens() {
    const [current, setCurrent] = useState(() => {
        return JSON.parse(localStorage.getItem("current")) || "ethereum";
    });
    const [watchlist, setWatchlist] = useState(() => {
        return JSON.parse(localStorage.getItem("watchlist")) || ["bitcoin", "ethereum"]
    });
    const [timeframe, setTimeframe] = useState(() => {
        return JSON.parse(localStorage.getItem("timeframe")) || "7d";
    });
    const [tokenList, setTokenList] = useState([]);
    const [watchlistData, setWatchlistData] = useState([]);
    const [data, setData] = useState([{
        image: {small: '-'},
        name: '-',
        symbol: '-',
        market_data: {
            current_price: {usd: 0},
            price_change_percentage_24h: 0,
            price_change_percentage_7d: 0,
            price_change_percentage_30d: 0,
            max_supply: 0,
            total_supply: 0,
            circulating_supply: 0,
            market_cap: {usd: 0},
            fully_diluted_valuation: {usd: 0}
        },
        links: {
            twitter_screen_name: '-',
            homepage: ['-'],
        },
        market_cap_rank: 0
    }]);
    const [chartData, setChartData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingChart, setLoadingChart] = useState(true);
    const [loadingInfo, setLoadingInfo] = useState(true);

    const [hideChart, setHideChart] = useState(() => {
        return JSON.parse(localStorage.getItem("hideChart")) || false;
    });
    const [gridCols, setGridCols] = useState(() => {
        return JSON.parse(localStorage.getItem("gridCols")) || 3;
    });


    const toggle = () => {
        setHideChart(!hideChart);
        localStorage.setItem("hideChart", JSON.stringify(!hideChart));
    };

    useEffect(() => {
        const fetchData = async () => {
            console.log("initial mount")
            setLoading(true);
            setLoadingInfo(true);
            setLoadingChart(true);
            const tokenListIn = await getTokenList();
            setTokenList(tokenListIn);

            const watchlistDataIn = await getWatchlistData(watchlist);
            setWatchlistData(watchlistDataIn);

            const currentData = await getCurrentData(current);
            setData(currentData);
            // console.log(currentData)

            const chartDataIn = await getChartData(tokenListIn, current, timeframe);
            setChartData(chartDataIn);

            setLoading(false);
            setLoadingInfo(false);
            setLoadingChart(false);
        }
        fetchData();
    }, [])

    useDidMountEffect(() => {
        const updateCurrent = async () => {
            console.log("update current")
            setLoadingInfo(true);
            const currentData = await getCurrentData(current);
            setData(currentData);
            const chartDataIn = await getChartData(tokenList, current, timeframe);
            setChartData(chartDataIn);

            setLoadingInfo(false);
        }
        updateCurrent();
    }, [current])

    useDidMountEffect(() => {
        const updateChartTimeframe = async () => {
            console.log("update timeframe")

            setLoadingChart(true);
            const chartDataIn = await getChartData(tokenList, current, timeframe);
            setChartData(chartDataIn);
            setLoadingChart(false);
        }
        updateChartTimeframe();
    }, [timeframe])

    useDidMountEffect(() => {
        const updateWatchlistData = async () => {
            console.log("update watchlist")

            const watchlistDataIn = await getWatchlistData(watchlist);
            setWatchlistData(watchlistDataIn);
        }
        updateWatchlistData();

    }, [watchlist])

    useInterval(() => {
        const updateInterval = async () => {
            console.log("update interval")
            const watchlistDataIn = await getWatchlistData(watchlist);
            setWatchlistData(watchlistDataIn);

            const currentData = await getCurrentData(current);
            setData(currentData);

            const chartDataIn = await getChartData(tokenList, current, timeframe);
            setChartData(chartDataIn);
        }
        updateInterval()
    }, 60000);


    const handleOnSelect = (item) => {
        setCurrent(item.id)
        console.log(item.id)
        localStorage.setItem("current", JSON.stringify(item.id));

    }


    function gridColumns(value) {
        return " grid-cols-" + value + " "
    }

    function incrementCols() {
        setGridCols(gridCols + 1)
        localStorage.setItem("gridCols", JSON.stringify(gridCols + 1));
    }

    function decreaseCols() {
        if (gridCols > 1) {
            setGridCols(gridCols - 1)
            localStorage.setItem("gridCols", JSON.stringify(gridCols - 1));
        }
    }

    return (
        <div className="mx-auto my-auto">
            <div
                className="flex flex-col w-full content-center items-center gap-2 text-gray-600 dark:text-gray-300 ">
                <div className={"flex flex-row gap-2 items-center w-full justify-start"}>
                    <button
                        type="button"
                        onClick={() => {
                            decreaseCols()
                        }}
                        // className="text-white focus:outline-none m-1.5 rounded px-6 py-2 font-medium bg-blue-600"
                    >
                        <AiOutlineMinus
                            // onClick={() => addWatchlist(current)}
                            className={"text-gray-500 text-2xl cursor-pointer"}
                        />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            incrementCols()
                            localStorage.setItem("gridCols", JSON.stringify(4));
                        }}
                        // className="text-white focus:outline-none m-1.5 rounded px-6 py-2 font-medium bg-blue-600"
                    >
                        <AiOutlinePlus
                            // onClick={() => addWatchlist(current)}
                            className={"text-gray-500 text-2xl cursor-pointer"}
                        />
                    </button>
                    <button
                        type="button"
                        onClick={toggle}
                        // className="text-white focus:outline-none m-1.5 rounded px-6 py-2 font-medium bg-blue-600"
                    >
                        <MdShowChart
                            // onClick={() => addWatchlist(current)}
                            className={(hideChart ? "  " : " text-gray-600 dark:text-gray-300 ") + "text-gray-500 text-2xl cursor-pointer"}
                        />
                    </button>

                </div>
                <div className="flex flex-row gap-4 w-full justify-start content-start text-center">
                    <div className={"w-full"}>

                        <div
                            className={"grid" + gridColumns(gridCols) + "w-full gap-4 items-stretch"}>
                            {watchlistData.map((project, index) => (
                                <div
                                    key={index}
                                    className={"w-full"}
                                    // onClick={setCurrent(project)}
                                >
                                    <button
                                        onClick={() => {
                                            setCurrent(project.id)
                                            localStorage.setItem("current", JSON.stringify(project.id));
                                        }}
                                        className="items-center text-center w-full text-lg pt-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a shadow-lg rounded-2xl"
                                    >
                                        <WatchlistCard data={project}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        className={((hideChart) ? " hidden " : "  ") + " flex flex-col w-full gap-2 py-4 items-center justify-center text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a shadow-lg rounded-lg"}>

                        <div className="flex flex-row justify-between gap-4 w-full px-8 items-center">
                            <div className="flex flex-row gap-4">
                                <CgNotes
                                    // onClick={() => addWatchlist(current)}
                                    className={"hidden text-gray-500 dark:text-gray-400 text-2xl cursor-pointer"}
                                />
                            </div>
                            <div style={{width: 400}}>
                                <ReactSearchAutocomplete
                                    items={tokenList}
                                    maxResults={20}
                                    // onSearch={handleOnSearch}
                                    // onHover={handleOnHover}
                                    onSelect={handleOnSelect}
                                    // onFocus={handleOnFocus}
                                    fuseOptions={
                                        {
                                            shouldSort: true,
                                            threshold: 0.7,
                                            location: 0,
                                            distance: 100,
                                            maxPatternLength: 32,
                                            minMatchCharLength: 2,
                                            keys: [
                                                "id",
                                                "symbol"
                                            ]
                                        }
                                    }
                                    autoFocus
                                    styling={
                                        {
                                            height: "40px",
                                            border: "1px solid #dfe1e5",
                                            borderRadius: "24px",
                                            backgroundColor: "white",
                                            boxShadow: "rgba(32, 33, 36, 0.28) 0px 1px 6px 0px",
                                            hoverBackgroundColor: "#eee",
                                            color: "#212121",
                                            fontSize: "16px",
                                            fontFamily: "Segoe UI",
                                            iconColor: "grey",
                                            lineColor: "rgb(232, 234, 237)",
                                            placeholderColor: "grey",
                                            clearIconMargin: '3px 14px 0 0',
                                            searchIconMargin: '0 0 0 16px'
                                        }
                                    }
                                />
                            </div>
                            <div className="flex flex-row gap-4">
                                <AiOutlineStar
                                    onClick={() => addWatchlist(watchlist, current, setWatchlist)}
                                    className={(watchlist.includes(current) ? " hidden " : "  ") + "text-gray-500 dark:text-gray-400 text-2xl cursor-pointer"}
                                />
                                <AiFillStar
                                    onClick={() => removeWatchlist(watchlist, current, setWatchlist)}
                                    className={(watchlist.includes(current) ? "  " : " hidden ") + "text-yellow-300 text-2xl cursor-pointer"}
                                />
                            </div>
                        </div>

                        <div
                            className={((loading) ? " hidden " : "  ") + "items-center text-center w-full"}>
                            <TokenCard
                                data={data[0]}
                                chartData={chartData}
                                timeframe={timeframe}
                                setTimeframe={setTimeframe}
                                loadingChart={loadingChart}
                                loadingInfo={loadingInfo}
                            />
                        </div>
                        <div
                            className={(loading ? "  " : " hidden ") + "items-center text-center w-full mx-auto my-auto"}>
                            <p>loading...</p>
                        </div>

                    </div>
                </div>

                {/*<div*/}
                {/*    className={`${loading ? " " : " hidden "}` + "flex flex-col content-start items-center px-4 text-gray-600 dark:text-gray-300 mx-auto my-auto"}>*/}
                {/*    <p>loading...</p>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}