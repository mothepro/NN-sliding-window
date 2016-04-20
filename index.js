/**
 * Normalize an Uint8Array list
 * around 'a'
 */
function convert(a) {
    if(Object.prototype.toString.call(a) === "[object Uint8Array]") {
        a.forEach(function (v, k) {
            a[k] = convert(v);
        });
        return a;
    }

    return a - 97; //'a'.charCodeAt();
}

function Sliding(data, size, onehot) {
    var ret = [],
        i, j, input, label;

    // convert all at once
    convert(data);

    for(var windowOffset = 0; windowOffset < data.length - size - 1; windowOffset++) {
        label = data[windowOffset + size];

        if(onehot) {
            tmp = [0, 0, 0, 0];
            tmp[label] = 1;
            label = tmp;
        }
        
        ret.push({
            input: Array.prototype.slice.call(data.slice(windowOffset, windowOffset + size)),
            label: label
        });
    }

    return ret;
}

module.exports = Sliding;