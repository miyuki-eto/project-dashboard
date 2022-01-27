// import Home from "../pages/home";
import Tokens from "../pages/tokens";
import Index from "../pages";

export const routes = [
    {
        path: '/',
        name: 'watchlist',
        exact: true,
        main: () => <Tokens/>
    },
    {
        path: '/index',
        name: 'index',
        exact: true,
        main: () => <Index/>
    }
]