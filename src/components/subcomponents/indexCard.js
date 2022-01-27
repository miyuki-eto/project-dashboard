import React, {useState, useEffect} from 'react';
import {currencyFormatZero, formatCurrency} from "../functions/format";
import EChart from "../charts/eChart";
import {ReactSearchAutocomplete} from "react-search-autocomplete";
import {ThemeContext} from "../structure/themeContext";
import Select from 'react-dropdown-select';
import GlobalButton from "./globalButton";
import AddButton from "./addButton";
import IndexMethodButton from "./indexMethodButton";
import RemoveButton from "./removeButton";
import {
    getCurrentData,
    getEqualData,
    getIndexTokenData,
    getIndexTokenPriceData,
    getPriceData,
    getTokenList
} from "../functions/api";
import ChartTableButton from "./chartTableButton";
import IndexTableRow from "./indexTableRow";
import UpdateButton from "./updateButton";
import {MdKeyboardArrowRight, MdKeyboardArrowDown, AiOutlineCheckCircle} from "react-icons/all";
import {methodMap} from "../defaults/defaults";
import RemoveIndexButton from "./removeIndexButton";


export default function IndexCard({
                                      i,
                                      current,
                                      currentData,
                                      name,
                                      data,
                                      globalMethod,
                                      addCallback,
                                      updateCallback,
                                      removeCallback,
                                      tokenData,
                                      chartData,
                                      denom,
                                      loadingChart,
                                      currentCallback,
                                      renameCallback,
                                      removeIndexCallback
                                  }) {
    const [expand, setExpand] = useState(false);
    const [tableChart, setTableChart] = useState(false);
    const [tempName, setTempName] = useState(name);
    // const [indexMethod, setIndexMethod] = useState(globalMethod);
    // const [indexMethodName, setIndexMethodName] = useState('global');
    const [global, setGlobal] = useState(true);
    const [equal, setEqual] = useState(false);
    const [manual, setManual] = useState(false);
    const [cap, setCap] = useState(false);
    const [vol, setVol] = useState(false);

    const denoms = ['global', 'equal', 'manual', 'cap', 'inv. vol'];

    useEffect(() => {
        setTempName(name);
        // setExpand(false);
    }, [name])

    function setMethod(value) {
        if (value === 'global') {
            if (global === true && equal === false && manual === false && cap === false && vol === false) {
                setGlobal(true)
            } else {
                setGlobal(!global);
            }
        } else if (value === 'equal') {
            if (global === false && equal === true && manual === false && cap === false && vol === false) {
                setGlobal(true)
                setEqual(!equal);
            } else {
                setEqual(!equal);
            }
        } else if (value === 'manual') {
            if (global === false && equal === false && manual === true && cap === false && vol === false) {
                setGlobal(true)
                setManual(!manual);
            } else {
                setManual(!manual);
            }
        } else if (value === 'cap') {
            if (global === false && equal === false && manual === false && cap === true && vol === false) {
                setGlobal(true)
                setCap(!cap);
            } else {
                setCap(!cap);
            }
        } else if (value === 'inv. vol') {
            if (global === false && equal === false && manual === false && cap === false && vol === true) {
                setGlobal(true)
                setVol(!vol);
            } else {
                setVol(!vol);
            }
        }
    }

    function setSeries(global, equal, manual, cap, vol) {
        // console.log(global)
        let series = [];
        if (equal || global === 'equal') {
            series.push({
                data: chartData[name].equal[1],
                name: "equal",
                type: "line",
                smooth: true,
                yAxisIndex: 0,
                symbolSize: 0,
                lineStyle: {
                    width: 1
                }
            })
        }
        if (manual || global === 'manual') {
            series.push({
                data: chartData[name].manual[1],
                name: "manual",
                type: "line",
                smooth: true,
                yAxisIndex: 0,
                symbolSize: 0,
                lineStyle: {
                    width: 1
                }
            })
        }
        if (cap || global === 'cap') {
            series.push({
                data: chartData[name].cap[1],
                name: "market cap",
                type: "line",
                smooth: true,
                yAxisIndex: 0,
                symbolSize: 0,
                lineStyle: {
                    width: 1
                }
            })
        }
        if (vol || global === 'inv. vol.') {
            series.push({
                data: chartData[name].vol[1],
                name: "inv vol",
                type: "line",
                smooth: true,
                yAxisIndex: 0,
                symbolSize: 0,
                lineStyle: {
                    width: 1
                }
            })
        }


        return series
    }


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
        grid: {top: 0, right: 55, bottom: expand ? 20 : 0, left: 0},
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#505765'
                }
            },
            // formatter: '{a0}: ${c0} <br /> {a1}: ${c1} <br /> {a2}: ${c2}',
            // formatter: function (params) {
            //
            //     return `${params.seriesName}<br />
            //   ${params.name}: ${params.data.price} (${params.data.market_cap}%)<br />
            //   ${params.data.tvl}`;
            // }
        },
        animationEasing: 'quadraticInOut',
        animationEasingUpdate: 'quadraticInOut',
        animationDuration: 2000,
        xAxis: {
            show: expand,
            type: "time",
            data: chartData[name].equal[0],
            axisLabel: {
                formatter: '{MM}-{dd}'
            }
        },
        yAxis: [
            {
                show: expand,
                name: "price",
                type: "value",
                scale: true,
                splitLine: {
                    show: false
                },
                position: "right",
                axisLabel: {
                    formatter: function (value, index) {
                        if (denom === 'usd') {
                            return '$' + value
                        } else if (denom === 'eth') {
                            return value + " Ξ"
                        } else if (denom === 'btc') {
                            return value + " btc"
                        }
                    },
                    show: true,
                    position: 'inside'
                }
            }
        ],
        series: setSeries(globalMethod, equal, manual, cap, vol)
    };

    const {theme} = React.useContext(ThemeContext);
    const colorSearchBg = (theme === 'light') ? '#ffffff' : '#161b22';
    const colorSearchText = (theme === 'light') ? '#757575' : '#e0e0e0';
    const colorSearchBorder = (theme === 'light') ? '#f5f5f5' : '#424242';

    const handleSubmit = (e) => {

        e.preventDefault();

        renameCallback(tempName, name)
        console.log(name)
        console.log(tempName)

    }

    return (
        <div
            className={"flex flex-col p-4 gap-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a shadow-lg rounded-2xl items-center text-center justify-center content-center mx-auto w-auto"}>
            <div className={"flex flex-row gap-2 w-full justify-center"}>
                <div className={"flex flex-col gap-2 justify-start items-center"}>
                    <div className={"flex flex-row gap-1 pr-4 items-center"}>
                        <button
                            onClick={() => {
                                setExpand(!expand)
                            }}>
                            <MdKeyboardArrowRight className={(expand ? "hidden " : "") + "text-3xl"}/>
                            <MdKeyboardArrowDown className={(expand ? "" : "hidden ") + "text-3xl"}/>
                        </button>


                        <div
                            className="flex flex-row gap-4 items-center justify-start px-4 text-left">
                            <form
                                onSubmit={handleSubmit}
                                className={"flex flex-row gap-1 "}>
                                <input
                                    className={"text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a text-2xl w-48 rounded-full px-2"}
                                    onChange={(e) => setTempName(e.target.value)}
                                    value={tempName}>
                                </input>
                                <button type='submit'>
                                    <AiOutlineCheckCircle
                                        className={((name === tempName) ? "hidden " : "text-green-500 dark:text-green-500 ") + "text-2xl "}/>
                                </button>
                            </form>
                            {/*<div*/}
                            {/*    // contentEditable="false"*/}
                            {/*    // onKeyDown={(e) => e.key === 'Enter' && renameCallback(e.currentTarget.textContent, name)}*/}
                            {/*    className="text-3xl w-36 rounded-full px-2 py-1"*/}
                            {/*>*/}
                            {/*    {name}*/}
                            {/*</div>*/}
                            {/*<button*/}
                            {/*    onClick={() => {*/}
                            {/*        editable()*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <MdKeyboardArrowDown className={"text-2xl"}*/}
                            {/*    />*/}
                            {/*</button>*/}
                            {/*<button*/}
                            {/*    onClick={() => {*/}
                            {/*        editable()*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <MdKeyboardArrowDown className={"text-2xl"}*/}
                            {/*    />*/}
                            {/*</button>*/}

                            {/*<p className="text-3xl">{data.unit}</p>*/}
                            <div className="text-2xl ml-12">{formatCurrency(data.price)}</div>

                        </div>
                        <div className={"flex flex-row gap-2  items-center justify-start"}>
                            <IndexMethodButton value={'global'} check={global} callback={setMethod}/>
                            <IndexMethodButton value={'equal'} check={equal} callback={setMethod}/>
                            <IndexMethodButton value={'manual'} check={manual} callback={setMethod}/>
                            <IndexMethodButton value={'cap'} check={cap} callback={setMethod}/>
                            <IndexMethodButton value={'inv. vol'} check={vol} callback={setMethod}/>

                        </div>
                    </div>
                    <div
                        className={(expand ? " hidden " : "  ") + "flex flex-row gap-2 w-full px-4 py-2 justify-start items-center"}>
                        {Object.keys(data.assets).map((asset, i) => (
                            <img
                                key={i}
                                src={tokenData[asset].image}
                                alt="ㅤ"
                                className="w-8"
                                title={tokenData[asset].name.toLowerCase()}
                            />
                        ))}
                    </div>
                    <div className={(expand ? " " : " hidden ") + "flex flex-row justify-center w-full mt-4 h-full"}>
                        <div className={"flex flex-col gap-2 justify-between h-full w-full"}>
                            <div className={"flex flex-row gap-1 justify-between w-full"}>
                                <div className={"flex flex-row gap-3 px-2"}>
                                    <ChartTableButton check={tableChart} callback={setTableChart}/>
                                </div>
                                <div className={"flex flex-row gap-3 px-2"}>

                                    <AddButton value={current} check={Object.keys(data.assets)}
                                               callback={addCallback}
                                               index={name} name={currentData.name}/>
                                    {/*<RemoveButton value={current} check={Object.keys(data.assets)}*/}
                                    {/*              callback={removeCallback} index={name}/>*/}
                                </div>
                            </div>
                            <div className={"flex flex-col justify-start h-full"}>
                                <div
                                    className={(tableChart ? "hidden " : "  ") + "justify-self-start rounded-2xl border border-gray-300 dark:border-gray-700 p-2"}>
                                    <table>
                                        <thead>
                                        <tr className={"px-1"}>
                                            <th className={"px-2"}>ㅤ</th>
                                            <th className={"px-2"}>token</th>
                                            <th className={"px-2"}>symbol</th>
                                            <th className={"px-2"}>price</th>
                                            <th className={"px-2"}>market cap</th>
                                            {/*<th className={"px-2"}>manual</th>*/}
                                            {/*<th className={"px-2"}>market cap</th>*/}
                                            {/*<th className={"px-2"}>inv. vol.</th>*/}
                                            <th className={"px-2"}>manual</th>
                                            <th className={"px-2"}>ㅤ</th>
                                            <th className={"px-2"}>ㅤ</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {Object.keys(data.assets).map((asset, i) => (
                                            <IndexTableRow
                                                index={name}
                                                asset={asset}
                                                data={tokenData[asset]}
                                                addCallback={updateCallback}
                                                removeCallback={removeCallback}
                                                currentCallback={currentCallback}
                                                indexData={data}
                                            />
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className={(tableChart ? "  " : " hidden ") + "w-full h-full"}>
                                <p>chart</p>
                            </div>
                            <div className={"flex flex-row w-full justify-start"}>
                                <RemoveIndexButton index={name} callback={removeIndexCallback}/>
                            </div>

                        </div>
                    </div>
                </div>

                <div className={(loadingChart ? " " : " hidden ") + "w-96 h-[500] mx-auto my-auto"}>
                    <p className={"h-full"}>loading...</p>
                </div>
                <div className={(loadingChart ? " hidden " : "  ") + "w-96 px-2"}>
                    <EChart
                        options={chart_options}
                        height={expand ? '400px' : '100px'}
                    />
                </div>
            </div>

        </div>
    );
}
