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

function Sliding(data, size, onehot) {
    var ret = [],
        i, j, input, label;

    // convert all at once
    convert(data);

    for(windowSize = 0; windowSize < data.length - size - 1; windowSize++) {
        if(onehot) {
            label = [0, 0, 0, 0];
            label[data[windowSize + 1]] = 1;
        } else
            label = data[windowSize + 1];
        ret.push({
            input: Array.prototype.slice.call(data.slice(windowSize, windowSize + size)),
            label: label
        });
    }

    return ret;
}

module.exports = Sliding;