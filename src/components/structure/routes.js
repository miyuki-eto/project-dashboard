// import Home from "../pages/home";
import Tokens from "../pages/tokens";

export const routes = [
    {
        path: '/',
        name: 'home',
        exact: true,
        main: () => <Tokens/>
    }
]