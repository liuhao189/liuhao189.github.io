let cache = {};
function eggDrop(K, N) {
    if (K === 1) return N;
    if (N === 0) return 0;
    let key = `Egg${K}Floor${N}`;
    if (cache[key] !== undefined) {
        return key;
    }
    let res = 0;
    for (let i = 0; i <= N; ++i) {
        res = min(res, max(
            eggDrop(K - 1, i - 1),
            eggDrop(K, N - i))
        )
    }
    cache[key] = res;
    return res;
}