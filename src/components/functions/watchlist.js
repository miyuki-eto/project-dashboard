export function removeWatchlist(data, token, callback) {
    let newWatchlist = [];
    data.forEach((x) => {
        if (x !== token) {
            newWatchlist.push(x)
        }
    })
    callback(newWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
}

export function addWatchlist(data, token, callback) {

    if (data.includes(token)) {
        console.log("already in watchlist")
    } else {
        console.log("added " + token)
        callback([...data, token]);
        localStorage.setItem("watchlist", JSON.stringify([...data, token]));
    }
}
