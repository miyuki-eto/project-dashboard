import React, {useState} from 'react';
import Toggle from "./themeToggle";
import {Link} from "react-router-dom";
import {routes} from "./routes";

function Header() {

    const [navbarOpen, setNavbarOpen] = useState(false)

    const handleToggle = () => {
        setNavbarOpen(prev => !prev)
    }

    return (
        <div>
            <div
                className="md:hidden flex flex-row w-full px-8 py-2 items-center justify-between bg-white dark:bg-custom-gray-a">
                <Link to="/">
                    <p className="text-lg text-center  text-gray-600 dark:text-gray-300">
                        logo
                    </p>
                </Link>
                <div className="flex flex-row space-between gap-4 text-gray-600 dark:text-gray-300 hidden md:flex">
                    <ul className="text-xl text-center w-full">

                        {routes.map((route) => (
                            <Link to={route.path} key={route.name.charAt(0)}>
                                <li className="rounded-lg px-2 py-2">
                                    {route.name}
                                </li>
                            </Link>
                        ))}
                    </ul>

                </div>
                <div className="flex flex-row items-center gap-4">
                    <div className="">
                        <Toggle/>
                    </div>
                    <button
                        className="mobile-menu-button md:hidden text-gray-600 dark:text-gray-300"
                        onClick={handleToggle}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="pb-2 text-gray-600 dark:text-gray-300">
                <ul className={`menuNav ${navbarOpen ? " showMenu flex flex-col text-lg  items-center bg-white dark:bg-custom-gray-a" : " hidden flex flex-col text-lg justify-center bg-white dark:bg-custom-gray-a"}`}>
                    {routes.map((route) => (
                        <Link to={route.path} key={route.name}>
                            <li className="rounded-lg px-2 py-2">
                                {route.name}
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Header;