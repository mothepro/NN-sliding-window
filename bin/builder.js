#!/usr/bin/env node
const pkg       = require('../package.json');
const program   = require('commander');
const sliding   = require('../lib/sliding.js');
const fs        = require('fs');

program
    .version(pkg.version)
    .description(pkg.description)
    .usage('[options] <file ...>')
    .option('-s, --window-size <int>', 'size of the Sliding window', function(a){ return parseInt(a, 10); })
    .option('-r, --range <a>..<b>', 'a range of windows', function (val) { return val.split('..').map(Number); }, [])
    .option('-o, --output <file>', 'path to save the sliding output [use % to replace with window size]')
    .option('-i, --input <file>', 'path to read the data stream')
    .option('--one-hot', 'make the label a one hot vector')
    .parse(process.argv);

// turn one size into a 'range'
if(program.windowSize)
    program.range = [program.windowSize, program.windowSize];

// we need a window size
// program.range = program.range || [];
if(program.range.length !== 2 || !program.input)
    program.help();
    
// program for all numbers in range
for(var ws = program.range[0]; ws <= program.range[1]; ws++) {
    // make Sliding window on all files
    if (program.output)
        var outFile = program.output.replace('%', ws);

    var data = fs.readFileSync(program.input),
        output = sliding(data, ws, program.oneHot);

    if (program.output) {
        fs.writeFileSync(outFile, JSON.stringify(output));
        console.log('Sliding window [%d] "%s" -> "%s"', ws, program.input, outFile);
    } else
        console.log(output);
}