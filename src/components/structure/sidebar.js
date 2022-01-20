import React, {useState} from 'react';
import Toggle from "./themeToggle";
import {Link} from "react-router-dom";
// import {routes} from "./routes";
//
// import {FiMenu} from 'react-icons/fi';
// import {addWatchlist} from "../functions/watchlist";
// import {AiOutlineStar} from "react-icons/ai";
import {AiOutlineTwitter} from "react-icons/ai";


function Sidebar() {

    const [expand, setExpand] = useState(false)

    const handleToggle = () => {
        setExpand(prev => !prev)
    }
    return (
        <div
            className={(expand ? "w-48 " : "w-14 ") + "hidden md:flex flex-col items-center justify-between "}>
            <div className="w-full p-4 flex flex-col gap-4 items-center">
                {/*<div className={(expand ? "text-left w-full " : "text-center ") + "transition duration-500 ease-in-out rounded-full p-2 "}>*/}
                {/*    <FiMenu*/}
                {/*        onClick={() => handleToggle()}*/}
                {/*        className={"text-gray-500 dark:text-gray-400 text-2xl cursor-pointer"}*/}
                {/*    />*/}
                {/*</div>*/}
                <Link to="/">
                    <p className="mb-8 text-lg text-center text-gray-600 dark:text-gray-300">
                        (˘ω˘)
                    </p>
                </Link>
                {/*<div className="flex flex-col space-between justify-self-start gap-4 text-gray-600 dark:text-gray-300">*/}
                {/*    <ul className="text-xl text-center">*/}
                {/*        {routes.map((route) => (*/}
                {/*            <Link to={route.path} key={route.name}>*/}
                {/*                <li className="flex flex-row rounded-lg px-2 py-2 items-center gap-2 justify-center">*/}
                {/*                    /!*{expand ? route.name : route.name.charAt(0)}*!/*/}
                {/*                    <AiOutlineStar*/}
                {/*                        className={" "}*/}
                {/*                    />*/}
                {/*                    <p className={(expand ? "  " : " hidden ") + ""}>{route.name}</p>*/}

                {/*                </li>*/}
                {/*            </Link>*/}
                {/*        ))}*/}
                {/*    </ul>*/}

                {/*</div>*/}
            </div>
            <div className={"flex flex-col gap-2 justify-center items-center"}>
                <a href='https://twitter.com/miyuki_crypto' target="_blank" rel="noreferrer">
                    <AiOutlineTwitter className={"text-xl text-center text-gray-600 dark:text-gray-300"}/>
                </a>
                <div className="mb-2">
                    <Toggle/>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;