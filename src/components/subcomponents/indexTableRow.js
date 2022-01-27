import React, { useState } from "react";

import {IoReload, AiOutlinePlus} from "react-icons/all";
import {currencyFormatZero, formatCurrency} from "../functions/format";
import AddButton from "./addButton";
import RemoveButton from "./removeButton";
import UpdateButton from "./updateButton";

export default function IndexTableRow({index, asset, data, addCallback, removeCallback, currentCallback, indexData}) {
    const [weight, setWeight] = useState(1);

    return (
        <tr className={"whitespace-nowrap gap-1 px-1"}>
            <td className={"px-2"}>
                <img
                    src={data.image}
                    alt="ㅤ"
                    className="w-6"/>
            </td>
            <td className={"px-2"}>
                <button
                    onClick={() => {
                        currentCallback(asset)
                    }}
                    className=""
                >
                    {data.name.toLowerCase()}
                </button>
            </td>
            <td className={"px-2"}>{data.symbol.toLowerCase()}</td>
            <td className={"px-2 text-end"}>{formatCurrency(data.current_price)}</td>
            <td className={"px-2 text-end"}>{currencyFormatZero.format(data.market_cap)}</td>
            {/*<td className={"px-2"}>{data.assets[asset].manual}</td>*/}
            {/*<td className={"px-2"}>{data.assets[asset].cap}</td>*/}
            {/*<td className={"px-2"}>{data.assets[asset].vol}</td>*/}
            <input
                className={"w-20 px-2 text-center text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a rounded-2xl border border-gray-200 dark:border-gray-800"}
                type="text"
                pattern="[0-9]*"
                value={weight}
                onChange={e => setWeight(e.target.value)}
            />
            <UpdateButton
                value={asset}
                check={Object.keys(indexData.assets)}
                callback={addCallback}
                index={index}
                weight={weight}
            />
            <RemoveButton
                value={asset}
                check={Object.keys(indexData.assets)}
                callback={removeCallback}
                index={index}
            />
        </tr>
    )
}