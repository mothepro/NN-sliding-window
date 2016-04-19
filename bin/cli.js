#!/usr/bin/env node
const package   = require('../package.json');
const program   = require('commander');
const sliding   = require('..');
const fs        = require('fs');

program
    .version(package.version)
    .usage('[options] <file ...>')
    .option('-s, --window-size <int>', 'Size of the Sliding window', function(a){ return parseInt(a, 10); }, 3)
    .option('-o, --output <file>', 'Where to save the Sliding output')
    .parse(process.argv);

// make Sliding window on all files
program.args.forEach(function(v) {
    fs.readFile(v, function (err, data) {
        if(err) throw err;

        // output
        var output = sliding(data, program.windowSize);

        if(program.output)
            fs.writeFile(program.output, JSON.stringify(output), function (err, ret) {
                if(err) throw err;
                console.log('Sliding Window of %d files written to %s.', program.args.length, program.output);
            });
        else
            console.log(output);
    })
});
