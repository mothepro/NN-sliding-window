#!/usr/bin/env node
const package   = require('../package.json');
const program   = require('commander');
const sliding   = require('..');
const fs        = require('fs');

program
    .version(package.version)
    .usage('[options] <file ...>')
    .option('-s, --window-size <int>', 'Size of the Sliding window', function(a){ return parseInt(a, 10); }, 3)
    .option('-o, --output <file>', 'Where to save the Sliding output, use % to replace with window size')
    .option('-r, --range <a>..<b>', 'A range of windows', function range(val) { return val.split('..').map(Number); })
    .option('--one-hot', 'Make the label a one hot vector')
    .parse(process.argv);
program.range = program.range || [];

// program for all numbers in range
if(program.range.length) {
    const spawn = require('child_process');

    for(var ws = program.range[0]; ws <= program.range[1]; ws++) {
        cli = spawn.execSync('node bin\\cli.js ' + [
                '-s', ws,
                '-o', program.output,
                program.args.join(' ')
            ].join(' '));

        console.log('Running with window size %d\n\t%s', ws, cli);
    }
} else {
    // make Sliding window on all files
    var outFile = '';
    if (program.output)
        outFile = program.output.replace('%', program.windowSize);
    program.args.forEach(function (v) {
        fs.readFile(v, function (err, data) {
            if (err) throw err;

            // output
            var output = sliding(data, program.windowSize, program.oneHot);

            if (program.output)
                fs.writeFile(outFile, JSON.stringify(output), function (err, ret) {
                    if (err) throw err;
                    console.log('Sliding Window of %d files written to %s.', program.args.length, outFile);
                });
            else
                console.log(output);
        });
    });
}