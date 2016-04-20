#!/usr/bin/env node
const package   = require('../package.json');
const program   = require('commander');
const sliding   = require('..');
const fs        = require('fs');

program
    .version(package.version)
    .usage('[options] <file ...>')
    .option('-s, --window-size <int>', 'size of the Sliding window', function(a){ return parseInt(a, 10); })
    .option('-o, --output <file>', 'path to save the sliding output [use % to replace with window size]')
    .option('-i, --input <file>', 'path to read the data stream')
    .option('-r, --range <a>..<b>', 'a range of windows', function (val) { return val.split('..').map(Number); })
    .option('--one-hot', 'make the label a one hot vector')
    .parse(process.argv);
program.range = program.range || [];

// turn one size into a 'range'
if(program.windowOffset)
    program.range[0] = program.range[1] = program.windowOffset;

// we need a window size
if(program.range.length !== 2 || !program.input)
    program.help();
    
// program for all numbers in range
for(var ws = program.range[0]; ws <= program.range[1]; ws++) {
    // make Sliding window on all files
    if (program.output)
        outFile = program.output.replace('%', ws);

    var data = fs.readFileSync(program.input),
        output = sliding(data, ws, program.oneHot);

    if (program.output) {
        fs.writeFile(outFile, JSON.stringify(output), function (err, ret) {if (err) throw err;});
        console.log('Sliding window [%d] "%s" -> "%s"', ws, program.input, outFile);
    } else
        console.log(output);
}