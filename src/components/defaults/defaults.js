export const defaultMethodData = [[[0, 0], [0, 0]], [[0, 0], [0, 0]]]

export const defaultChartData = {
    equal: defaultMethodData,
    manual: defaultMethodData,
    cap: defaultMethodData,
    vol: defaultMethodData
}

export const defaultIndexChartData = {
    majors: defaultChartData,
    options: defaultChartData
}

export const defaultSearchData = {
    image: {small: '-'},
    name: '-',
    symbol: '-',
    market_data: {
        current_price: {usd: 0},
        price_change_percentage_24h: 0,
        price_change_percentage_7d: 0,
        price_change_percentage_30d: 0,
        max_supply: 0,
        total_supply: 0,
        circulating_supply: 0,
        market_cap: {usd: 0},
        fully_diluted_valuation: {usd: 0}
    },
    links: {
        twitter_screen_name: '-',
        homepage: ['-'],
    },
    market_cap_rank: 0
}

export const defaultTokenInfo = {
    image: '',
    name: '',
    symbol: '',
    market_cap: '',
    current_price: '',
}

export const defaultTokenData = {
    bitcoin: defaultTokenInfo,
    ethereum: defaultTokenInfo,
    'ribbon-finance': defaultTokenInfo,
    dopex: defaultTokenInfo,
}

export const defaultIndexAssetData = {price: 0, market_cap: 0, equal: 1, manual: 1, cap: 1, vol: 1}

export const defaultIndex = {
    majors: {
        unit: 'price',
        price: 0,
        assets: {
            bitcoin: defaultIndexAssetData,
            ethereum: defaultIndexAssetData,
        }
    },
    options: {
        unit: 'price',
        price: 0,
        assets: {
            'ribbon-finance': defaultIndexAssetData,
            dopex: defaultIndexAssetData,
        }
    },
}

export const defaultIndexEmpty = {
    unit: 'price',
    price: 0,
    assets: {}
}

