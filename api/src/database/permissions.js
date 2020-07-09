function checkBin (int, bin) {
    return !!(int & bin);
}

function parse(int, checkIn) {
    const matches = [];
    for (let obj in checkIn) {
        if(checkBin(int, checkIn[obj])) {
            matches.push(obj);
        }
    }
    return matches;
}

function exists(arr, checkIn) {
    for (let obj of arr) {
        if (!(obj in checkIn)) throw {
            error: 'Not a valid permission',
            perm: obj,
        };
    }
}

function has(int, arr, checkIn) {
    const perms = parse(int, checkIn);
    for (let obj of arr) {
        if (!perms.includes(obj)) return false;
    }
    return true;
}

function set(int, arr, checkIn) {
    let result = int;
    for (let obj of arr) {
        result = result | checkIn[obj];
    }
    return result;
}

function remove(int, arr, checkIn) {
    let result = int;
    for (let obj of arr) {
        result = result & ~ checkIn[obj];
    }
    return result;
}

module.exports = {
    parse,
    exists,
    has,
    set,
    remove,
};
