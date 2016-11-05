const cp = require('child_process');
const fs = require('fs');

process.chdir(__dirname + '/..');

// clean dirs
['logs\\', 'build\\'].forEach(function (dir) {
    if(fs.existsSync(dir)) { // clean dir
        fs.readdirSync(dir).forEach(function (file) {
            fs.unlink(dir + file);
        });
    } else // mkdir
        fs.mkdirSync(dir, parseInt(666, 8));
});

// data to work with
const dataSets = [1, 2];
const windowRange =[4, 5, 6, 7, 8, 9];

dataSets.forEach(function (dataSet) {
    console.log('Dataset', dataSet);
    windowRange.forEach(function (windowSize) {
        console.log('Building sliding window', windowSize);

        console.log(cp.execSync(['node', 'bin/builder.js',
                '--one-hot',
                '-s', windowSize,
                '-i', 'assets/data-' + dataSet + '.txt',
                '-o', 'build/data-' + dataSet + '-%.json',
            ].join(' ')).toString('utf8'));

        console.log(cp.execSync(["python", "nn/nn.py",
            "-d", dataSet,
            "-i", windowSize,
            "-h", 45,
            "-b", 1,
            ">", "logs/nn-"+dataSet +"-"+ windowSize +"-45-1.log"].join(' ')).toString('utf8'))
    })
});

/*
for d in `seq 1 2`;
do
    echo Dataset $d
for i in `seq 4 9`;
do
    echo Building sliding window of size $i
node builder.js --one-hot -s $i -i assets/data-$d.txt -o build/data-$d-%.json

echo -e "\tRunning Neural Network with $i input neurons"
echo -e "\t\t45 hidden neurons"
python nn/nn.py -d $d -i $i -h 45 -b 1  > logs/nn-$d-$i-45-1.log
python nn/nn.py -d $d -i $i -h 45 -b 50 > logs/nn-$d-$i-45-50.log

echo -e "\t\t$((2 * $i)) hidden neurons"
python nn/nn.py -d $d -i $i -h $((2 * $i)) -b 1  > logs/nn-$d-$i-$((2 * $i))-1.log
python nn/nn.py -d $d -i $i -h $((2 * $i)) -b 50 > logs/nn-$d-$i-$((2 * $i))-50.log

echo -e "\tRunning Deep Neural Network with $i input neurons"
echo -e "\t\t45 hidden neurons"
python nn/dnn.py -d $d -i $i -h 45 -b 1  > logs/deep-$d-$i-45-1.log
python nn/dnn.py -d $d -i $i -h 45 -b 50 > logs/deep-$d-$i-45-50.log

echo -e "\t\t$((2 * $i)) hidden neurons"
python nn/dnn.py -d $d -i $i -h $((2 * $i)) -b 1  > logs/deep-$d-$i-$((2 * $i))-1.log
python nn/dnn.py -d $d -i $i -h $((2 * $i)) -b 50 > logs/deep-$d-$i-$((2 * $i))-50.log
done
done
*/