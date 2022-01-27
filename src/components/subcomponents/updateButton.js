import React from "react";

import { IoReload, AiOutlinePlus } from "react-icons/all";

export default function UpdateButton({ value, check, callback, index, weight}) {
return (
    <button
        className={(check.includes(value) ? "  " : "  ") + "text-xl rounded-full border-gray-500 items-center px-1 h-full my-auto mx-auto"}
        onClick={() => {
            callback(index, value, weight)
            // localStorage.setItem(value, JSON.stringify(value));
        }}>
        {/*{(check.includes(value)) ? 'update' : 'add'}*/}
        <IoReload
            // onClick={() => addWatchlist(current)}
            className={"text-blue-500 text-xl cursor-pointer h-full items-center justify-center my-auto mx-auto"}
        />
        {/*<AiOutlinePlus*/}
        {/*    // onClick={() => addWatchlist(current)}*/}
        {/*    className={(check.includes(value) ? " hidden " : "  ") + "text-green-500 text-xl cursor-pointer"}*/}
        {/*/>*/}
    </button>
)
}