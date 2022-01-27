import React, {useEffect, useState} from 'react';
import {
    getCurrentData, getEqualData,
    getIndexTokenData,
    getIndexTokenPriceData,
    getPriceData,
    getTokenList,
    getWatchlistData
} from "../functions/api";
import {ThemeContext} from "../structure/themeContext";
import IndexSearch from "../subcomponents/indexSearch";
import IndexCard from "../subcomponents/indexCard";
import {AiOutlinePlus} from 'react-icons/all'
import {
    defaultIndex,
    defaultIndexAssetData,
    defaultIndexChartData, defaultIndexEmpty, defaultMethodData,
    defaultSearchData,
    defaultTokenData, defaultTokenInfo
} from "../defaults/defaults";
import useLocalStorage from "../functions/useLocalStorage";
import {useDidMountEffect} from "../functions/useInterval"

export default function Index() {
    const [indexes, setIndexes] = useState(() => {
        return JSON.parse(localStorage.getItem("indexes")) || defaultIndex;});

    const [indexNames, setIndexNames] = useState(getIndexNames(indexes));
    const [indexTokens, setIndexTokens] = useState(getIndexTokens(indexes));
    const [current, setCurrent] = useLocalStorage("current", "ethereum");
    const [denom, setDenom] = useLocalStorage("denomination", "usd");
    const [globalMethod, setGlobalMethod] = useLocalStorage("global_method", "equal");
    const [timeframe, setTimeframe] = useLocalStorage("timeframe", "7d");
    const [weight, setWeight] = useState(1);
    const [newIndexName, setNewIndexName] = useState("test");
    const [tokenList, setTokenList] = useState([]);
    const [data, setData] = useState([defaultSearchData]);
    const [tokenData, setTokenData] = useState(defaultTokenData);
    const [chartData, setChartData] = useState([]);
    const [indexChartData, setIndexChartData] = useState(defaultIndexChartData);

    const [loadingSearch, setLoadingSearch] = useState(true);
    const [loadingIndex, setLoadingIndex] = useState(true);

    const {theme} = React.useContext(ThemeContext);
    const colorSearchBg = (theme === 'light') ? '#ffffff' : '#161b22';
    const colorSearchText = (theme === 'light') ? '#757575' : '#e0e0e0';
    const colorSearchBorder = (theme === 'light') ? '#f5f5f5' : '#424242';


    useEffect(() => {
        const fetchData = async () => {
            console.log("[EFFECT] initial mount")
            setLoadingSearch(true);
            setLoadingIndex(true);
            const tokenListIn = await getTokenList();
            setTokenList(tokenListIn);

            const currentData = await getCurrentData(current);
            setData(currentData);

            const chartDataIn = await getPriceData(timeframe, current, denom);
            const priceData = await splitPriceData(chartDataIn);
            setChartData(priceData);

            setIndexNames(getIndexNames(indexes));
            setIndexTokens(getIndexTokens(indexes));

            const tokenDataIn = await getIndexTokenData(indexTokens);
            setTokenData(tokenDataIn);

            const indexChartDataIn = await getIndexTokenPriceData(indexTokens, timeframe, denom, indexes);
            setIndexChartData(indexChartDataIn);

            setLoadingSearch(false);
            setLoadingIndex(false);
        }
        fetchData();
    }, [])

    useDidMountEffect(() => {
        const updateCurrent = async () => {
            console.log("[EFFECT] update current")
            setLoadingSearch(true);
            const currentData = await getCurrentData(current);
            setData(currentData);
            const chartDataIn = await getPriceData(timeframe, current, denom);
            const priceData = await splitPriceData(chartDataIn);
            setChartData(priceData);
            setLoadingSearch(false);
        }
        updateCurrent();
    }, [current])

    useDidMountEffect(() => {
        const updateTimeframe = async () => {
            console.log("[EFFECT] update timeframe")
            setLoadingSearch(true);
            setLoadingIndex(true);
            const chartDataIn = await getPriceData(timeframe, current, denom);
            const priceData = await splitPriceData(chartDataIn);
            setChartData(priceData);

            const indexChartDataIn = await getIndexTokenPriceData(indexTokens, timeframe, denom, indexes);
            setIndexChartData(indexChartDataIn);
            setLoadingSearch(false);
            setLoadingIndex(false);
        }
        updateTimeframe();
    }, [timeframe, denom])

    useDidMountEffect(() => {
        const updateTimeframe = async () => {
            console.log("[EFFECT] update index tokens")
            setIndexNames(getIndexNames(indexes));
            setIndexTokens(getIndexTokens(indexes));

            const indexChartDataIn = await getIndexTokenPriceData(getIndexTokens(indexes), timeframe, denom, indexes);
            setIndexChartData(indexChartDataIn);
        }
        updateTimeframe();
    }, [indexes])

    useDidMountEffect(() => {
        const updateTimeframe = async () => {
            console.log("[EFFECT] update index tokens data")
            const tokenDataIn = await getIndexTokenData(getIndexTokens(indexes));
            setTokenData(tokenDataIn);
        }
        updateTimeframe();
    }, [indexTokens])


    async function splitPriceData(data) {
        const priceList = [];

        await data.forEach((x) => {
            priceList.push(x.price);
        })
        return priceList
    }

    function getIndexNames(data) {
        const priceList = [];
        for (let x of Object.keys(data)) {
            priceList.push(x);
        }
        return priceList
    }

    function getIndexTokens(data) {
        const priceList = [];
        for (let x of Object.keys(data)) {
            for (let y of Object.keys(data[x].assets)) {
                priceList.push(y);
            }
        }
        return priceList
    }


    const handleOnSelect = (item) => {
        setCurrent(item.id)
        console.log(`[STATE] set search to ${item.id.toUpperCase()}`)
    }

    const weightCallback = (item) => {
        setWeight(parseFloat(item))
        console.log(item)
    }

    function addCallback(item, check, index) {
        if (check) {
            console.log(`[STATE] add ${item.toUpperCase()} to ${index.toUpperCase()}`)

            setIndexes({
                ...indexes, [index]: {
                    ...indexes[index],
                    assets: {
                        ...indexes[index].assets,
                        [item]: defaultIndexAssetData
                    },

                },
            })
            if (!Object.keys(tokenData).includes(item)) {
                setTokenData({
                    ...tokenData, [item]: defaultTokenInfo,
                })
            }
        }
        // setWeight(item)
        // console.log(item)
    }

    function updateTokenWeight(index, item, weight) {
        if (!isNaN(weight) && indexes[index].assets[item].manual !== weight) {
            console.log(`[STATE] update ${item.toUpperCase()} weight to ${weight} in ${index.toUpperCase()}`)
            setIndexes({
                ...indexes, [index]: {
                    ...indexes[index],
                    assets: {...indexes[index].assets, [item]: {...indexes[index].assets[item], manual: weight}},

                },
            })
        } else {
            console.log("empty or unchanged weight")
        }
    }

    function addIndex() {
        const newIndexName = "new index"
            console.log('[STATE] add new index')
            setIndexes({
                ...indexes, [newIndexName]: defaultIndexEmpty
            })
            setIndexChartData({
                ...indexChartData, [newIndexName]: {
                    equal: defaultMethodData
                }
            })

    }

    function removeIndex(indexName) {
        console.log(`[STATE] remove index - ${indexName.toUpperCase()}`)
        // let newObjState = Object.assign({}, indexes)
        // delete newObjState[indexName]
        // setIndexes(newObjState);
        //
        // let newObjStateChart = Object.assign({}, indexChartData)
        //
        // delete newObjStateChart[indexName]
        // setIndexChartData(newObjStateChart);

        const newIndexes = {};
        indexNames.forEach((x, i) => {
            if (x !== indexName) {
                newIndexes[x] = indexes[x]
            }
        })
        setIndexes(newIndexes);
        const newChart = {};
        Object.keys(indexChartData).forEach((x, i) => {
            if (x !== indexName) {
                newChart[x] = indexChartData[x]
            }
        })
        setIndexChartData(newChart);

    }


    function removeCallback(item, check, index) {
        console.log(`[STATE] remove ${item.toUpperCase()} from ${index.toUpperCase()}`)
        if (check) {
            let newObjState = Object.assign({}, indexes)
            console.log('remove token from index')
            delete newObjState[index].assets[item]
            // console.log(newObjState);
            setIndexes(newObjState);
        }
    }

    function renameIndex(newName, oldName) {
        console.log(`[STATE] rename ${oldName.toUpperCase()} to ${newName.toUpperCase()}`)
        console.log(oldName)
        console.log(newName)
        const replaces = {[oldName]: newName}
        const newIndexes = renameProps (replaces, indexes)
        const newChart = renameProps (replaces, indexChartData)

        setIndexes(newIndexes)
        setIndexChartData(newChart)

    }

    const fromEntries = entries =>
        entries.reduce ((o, [key, value]) => ({ ...o, [key]: value }), {})

    const renameProps = (replaces, obj) =>
        fromEntries (
            Object.entries (obj)
                .map (([key, value]) => [
                    replaces.hasOwnProperty (key) ? replaces[key] : key,
                    value
                ])
        )


    return (
        <div className="px-8 mx-auto my-auto h-full py-12">
            <div className="flex flex-col gap-4 text-gray-600 dark:text-gray-300 h-full text-center">
                <IndexSearch
                    loading={loadingSearch}
                    tokens={tokenList}
                    indexNames={indexNames}
                    data={data[0]}
                    chartData={chartData}
                    searchSelect={handleOnSelect}
                    denom={denom}
                    denomCallback={setDenom}
                    method={globalMethod}
                    methodCallback={setGlobalMethod}
                    timeframe={timeframe}
                    timeframeCallback={setTimeframe}
                    weight={weight}
                    weightCallback={weightCallback}
                    newIndexName={newIndexName}
                    newIndexNameCallback={setNewIndexName}
                    addIndexCallback={addIndex}
                />
                {Object.keys(indexes).map((index, i) => (
                    <IndexCard
                        current={current}
                        currentData={data[0]}
                        name={index}
                        data={indexes[index]}
                        globalMethod={globalMethod}
                        // addCallback={}
                        tokenData={tokenData}
                        chartData={indexChartData}
                        i={i}
                        denom={denom}
                        addCallback={addCallback}
                        updateCallback={updateTokenWeight}
                        removeCallback={removeCallback}
                        loadingChart={loadingIndex}
                        currentCallback={setCurrent}
                        renameCallback={renameIndex}
                        removeIndexCallback={removeIndex}
                    />
                ))}

                    <div className={"flex flex-row justify-start"}>
                        <button
                            className={"flex flex-row text-xl text-gray-300 dark:text-gray-600 rounded-full border-gray-500 px-2 py-1 items-center"}
                            onClick={() => {
                                addIndex()
                                // localStorage.setItem(value, JSON.stringify(value));
                            }}>
                            <AiOutlinePlus
                                // onClick={() => addWatchlist(current)}
                                className={"text-2xl mr-4"}
                            />
                            add new index
                        </button>
                    </div>

            </div>
        </div>
    );
}
