import React from "react";
import {Route} from "react-router-dom";

import {routes} from "./routes";
import Header from "./header";
import Sidebar from "./sidebar";

function Main(props) {
    return (
        <div className="h-screen w-screen overflow-y-auto font-sans font-thin">
            {routes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact}
                >
                    <div className="flex flex-row h-full">
                        <Sidebar/>
                        <div className="flex flex-col w-full">
                            <Header/>
                            <route.main/>
                        </div>
                    </div>
                </Route>
            ))}
        </div>
    );
}

export default Main;