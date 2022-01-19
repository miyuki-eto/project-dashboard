import axios from "axios";

export async function getTokenList() {
    const data = [];
    await axios.get("https://api.coingecko.com/api/v3/coins/list").then(response => {
        data.push(response.data)
    })
    return data[0];
}

export async function getWatchlistData(watchlist) {
    let text = watchlist.join("%2C%20");
    const data = [];
    await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" + text + "&order=market_cap_desc&per_page=100&page=1&sparkline=true").then(x => {
        // console.log(x.functions)
        data.push(x.data)
    })
    return data[0];
}

export async function getCurrentData(current) {
    const data = [];
    await axios.get("https://api.coingecko.com/api/v3/coins/" + current).then(x => {
        if (x.data.market_data.circulating_supply === null) {
            x.data.market_data.circulating_supply = 0;
        }
        if (x.data.market_data.max_supply === null) {
            x.data.market_data.max_supply = 0;
        }
        if (x.data.market_data.fully_diluted_valuation === null) {
            x.data.market_data.fully_diluted_valuation = 0;
        }
        data.push(x.data)
    })
    return data;
}

async function getLlamaList() {
    const data = [];
    await axios.get("https://api.llama.fi/protocols").then(x => {
        // console.log(x.functions)
        data.push(x.data)
    })
    return data[0];
}

async function getChainList() {
    const data = [];
    await axios.get("https://api.llama.fi/chains").then(x => {
        // console.log(x.functions)
        data.push(x.data)
    })
    return data[0];
}

async function getLlamaId(tokens) {
    const llamaListIn = await getLlamaList();
    const chainListIn = await getChainList();
    const a = {};
    await tokens.forEach((x) => {
        const z = {};
        z["id"] = "-";
        z["project"] = "-";
        llamaListIn.forEach((y) => {
            if (y.gecko_id === x.id) {
                z["id"] = y.slug;
                z["project"] = "protocol";
            }
        })
        chainListIn.forEach((y) => {
            if (y.gecko_id === x.id) {
                z["id"] = y.name;
                z["project"] = "chain";
            }
        })
        a[x.id] = z
    });
    // console.log(a)
    return a;
}


async function getPriceData(timeframe, current) {
    const data = [];
    const now = Math.floor(Date.now() / 1000);
    const from = timeCalc(now, timeframe);
    // console.log(now)
    await axios.get("https://api.coingecko.com/api/v3/coins/" + current + "/market_chart/range?vs_currency=usd&from=" + from + "&to=" + now).then(x => {
        // console.log(x.functions)
        data.push(x.data)
    })
    // console.log(functions[0])
    const formattedData = [];
    data[0].prices.forEach((x, i) => {
        const entry = {};
        entry.timestamp = x[0]
        entry.price = x[1]
        entry.market_cap = data[0].market_caps[i][1]
        formattedData.push(entry)
    })

    return formattedData;
}

async function getLlamaData(filter, llamaId, geckoData) {
    const data = [];
    // console.log(llamaId)
    // console.log(filter)
    const llama_id = llamaId["id"];
    const llama_type = llamaId["project"];
    if (llama_type === "protocol") {
        await axios.get("https://api.llama.fi/protocol/" + llama_id).then(x => {
            // console.log(x.functions)
            x.data.tvl.forEach((y) => {
                if (y["date"] >= filter) {
                    data.push(y)
                }
            })
        })
    } else if (llama_type === "chain") {
        await axios.get("https://api.llama.fi/charts/" + llama_id).then(x => {
            // console.log(x.functions)
            x.data.forEach((y) => {
                if (y["date"] >= filter) {
                    data.push(y)
                }
            })
        })
    } else {
        geckoData.forEach((x) => {
            data.push('-')
        })
    }
    // console.log(functions[0])
    const newData = [];
    data.forEach((x) => {
        const y = {};
        y["timestamp"] = parseInt(x.date * 1000);
        y["totalLiquidityUSD"] = x.totalLiquidityUSD;
        newData.push(y)
    })
    // console.log(newData)
    return newData;
}

function timeCalc(now, span) {
    let newValue = 0;
    const hour = 60 * 60;
    const day = 24 * hour;
    if (span === "24h") {
        newValue = now - (24 * hour)
    } else if (span === "7d") {
        newValue = now - (7 * day)
    } else if (span === "30d") {
        newValue = now - (30 * day)
    } else if (span === "90d") {
        newValue = now - (90 * day)
    } else if (span === "365d") {
        newValue = now - (365 * day)
    } else {
        newValue = 1367330400
    }
    return newValue
}

async function mergeData(geckoIn, llamaIn) {
    // console.log(geckoIn)
    const newArr = [];
    await geckoIn.forEach((x, i) => {
        const z = {
            timestamp: x.timestamp,
            price: x.price,
            market_cap: x.market_cap,
            totalLiquidityUSD: '-'
        };
        llamaIn.forEach((y, j) => {
            if (y.timestamp < x.timestamp && y.timestamp >= geckoIn[i - 1].timestamp) {
                // console.log(y)
                z["totalLiquidityUSD"] = y.totalLiquidityUSD
            }
        })
        newArr.push(z)
    });
    // console.log(newArr)
    return newArr;
}

async function splitData(data) {
    const timeList = [];
    const priceList = [];
    const capList = [];
    const tvlList = [];

    await data.forEach((x) => {
        const time = x.timestamp;
        priceList.push([time, x.price]);
        capList.push([time, x.market_cap]);
        tvlList.push([time, x.totalLiquidityUSD]);

    })
    return [timeList, priceList, capList, tvlList]
}

export async function getChartData(tokens, current, timeframe) {
    const llamaId = await getLlamaId(tokens)
    const priceDataIn = await getPriceData(timeframe, current);
    const llamaDataIn = await getLlamaData(Math.ceil(priceDataIn[0]["timestamp"] / 1000), llamaId[current], priceDataIn);
    const mergedIn = await mergeData(priceDataIn, llamaDataIn);
    return await splitData(mergedIn);
}