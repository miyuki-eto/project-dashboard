import React, {useState, useEffect} from "react";
import TokenCard from "../../components/tokenCard";
import WatchlistCard from "../watchlistCard";

import {ReactSearchAutocomplete} from 'react-search-autocomplete'
import axios from "axios";
import axiosThrottle from 'axios-request-throttle';

import {AiFillStar} from 'react-icons/ai';
import {AiOutlineStar} from 'react-icons/ai';
import {CgNotes} from "react-icons/all";

import {removeWatchlist, addWatchlist} from "../functions/watchlist";
import {useInterval, useDidMountEffect} from "../functions/useInterval";
import {getTokenList, getWatchlistData, getCurrentData, getChartData} from "../functions/api";

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
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState([]);


    const [loading, setLoading] = useState(true);
    const [loadingChart, setLoadingChart] = useState(true);
    const [loadingInfo, setLoadingInfo] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            console.log("initial mount")
            const tokenListIn = await getTokenList();
            setTokenList(tokenListIn);

            const watchlistDataIn = await getWatchlistData(watchlist);
            setWatchlistData(watchlistDataIn);

            const currentData = await getCurrentData(current);
            setData(currentData);

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
            setLoading(false);
        }
        updateInterval()
    }, 600000);


    const handleOnSelect = (item) => {
        setCurrent(item.id)
        console.log(item.id)
        localStorage.setItem("current", JSON.stringify(item.id));

    }


    return (
        <div className="px-8 mx-auto my-auto">
            <div
                className="flex flex-col w-full content-center items-center gap-4 px-4 text-gray-600 dark:text-gray-300 ">
                <div className="flex flex-row gap-4 w-full p-4 justify-center content-center text-center">
                    <div
                        className="grid grid-cols-3 w-full gap-4 justify-start">
                        {watchlistData.map((project, index) => (
                            <div
                                key={index}
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
                    <div
                        className={(loading ? " hidden " : "  ") + " flex flex-col w-full gap-2 py-4 items-center justify-center text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a shadow-lg rounded-lg"}>

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
                            className={(loadingInfo ? " hidden " : "  ") + "items-center text-center w-full"}>
                            <TokenCard
                                data={data[0]}
                                chartData={chartData}
                                timeframe={timeframe}
                                setTimeframe={setTimeframe}
                                loadingChart={loadingChart}
                            />
                        </div>
                        <div
                            className={(loadingInfo ? "  " : " hidden ") + "items-center text-center w-full mx-auto my-auto"}>
                            <p>loading...</p>
                        </div>

                    </div>
                </div>

                <div
                    className={`${loading ? " " : " hidden "}` + "flex flex-col content-start items-center px-4 text-gray-600 dark:text-gray-300 mx-auto my-auto"}>
                    <p>loading...</p>
                </div>
            </div>
        </div>
    );
}