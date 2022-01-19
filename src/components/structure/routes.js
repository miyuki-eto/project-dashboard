// import Home from "../pages/home";
import Tokens from "../pages/tokens";

export const routes = [
    {
        path: '/',
        name: 'watchlist',
        exact: true,
        main: () => <Tokens/>
    }
]