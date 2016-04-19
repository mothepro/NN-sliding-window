/**
 * Created by Mo on 4/19/2016.
 */

// chars to ints
var convert = function (a) {
    if(Object.prototype.toString.call(a) === "[object Uint8Array]") {
        a.forEach(function (v, k) {
            a[k] = convert(v);
        });
        return a;
    }

    return a - 97; //'a'.charCodeAt();
};

function Sliding(data, size) {
    var ret = [],
        i, j, input;

    // convert all at once
    convert(data);

    for(i = 0; i < data.length - size - 1; i++)
        ret.push({
            input: data.slice(i, i + size),
            label: data[i+1]
        });

    return ret;
}

module.exports = Sliding;