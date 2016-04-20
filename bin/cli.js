#!/usr/bin/env node
const package   = require('../package.json');
const program   = require('commander');
const sliding   = require('..');
const fs        = require('fs');

program
    .version(package.version)
    .usage('[options] <file ...>')
    .option('-s, --window-size <int>', 'Size of the Sliding window', function(a){ return parseInt(a, 10); }, 3)
    .option('-o, --output <file>', 'Path to save the sliding output [use % to replace with window size]')
    .option('-i, --input <file>', 'Path to read the data stream')
    .option('-r, --range <a>..<b>', 'A range of windows', function (val) { return val.split('..').map(Number); })
    .option('--one-hot', 'Make the label a one hot vector')
    .parse(process.argv);
program.range = program.range || [];

// turn one size into a 'range'
if(program.windowSize)
    program.range[0] = program.range[1] = program.windowSize;

// program for all numbers in range
for(var ws = program.range[0]; ws <= program.range[1]; ws++) {
    // make Sliding window on all files
    if (program.output)
        outFile = program.output.replace('%', program.windowSize);

    fs.readFile(program.input, function (err, data) {
        if (err) throw err;

        // output
        var output = sliding(data, program.windowSize, program.oneHot);

        if (program.output)
            fs.writeFile(outFile, JSON.stringify(output), function (err, ret) {
                if (err) throw err;
                console.log('Sliding window [%d] "%s" -> "%s"', ws, program.input, outFile);
            });
        else
            console.log(output);
    });
}