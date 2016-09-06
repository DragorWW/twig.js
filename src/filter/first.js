module.exports = function (value) {
    if (is("Array", value)) {
        return value[ 0 ];
    } else if (is("Object", value)) {
        if ('_keys' in value) {
            return value[ value._keys[ 0 ] ];
        }
    } else if (typeof value === "string") {
        return value.substr(0, 1);
    }

    return;
}
