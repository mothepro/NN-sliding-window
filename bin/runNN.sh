#!/bin/bash
cd "$(dirname "$0")" # working directory
cd ../

mkdir -p logs/
trash logs/*.log

for d in `seq 1 2`;
do
    echo Dataset $d
    for i in `seq 4 9`;
    do
#        echo Building sliding window of size $i
#        node builder.js --one-hot -i ../assets/data-$d.txt

        echo -e "\tRunning Neural Network with $i input neurons"
            echo -e "\t\t45 hidden neurons"
            python nn.py -d $d -i $i -h 45 -b 1  > logs/nn-$d-$i-45-1.log
            python nn.py -d $d -i $i -h 45 -b 50 > logs/nn-$d-$i-45-50.log

            echo -e "\t\t$((2 * $i)) hidden neurons"
            python nn.py -d $d -i $i -h $((2 * $i)) -b 1  > logs/nn-$d-$i-$((2 * $i))-1.log
            python nn.py -d $d -i $i -h $((2 * $i)) -b 50 > logs/nn-$d-$i-$((2 * $i))-50.log

        echo -e "\tRunning Deep Neural Network with $i input neurons"
            echo -e "\t\t45 hidden neurons"
            python dnn.py -d $d -i $i -h 45 -b 1  > logs/deep-$d-$i-45-1.log
            python dnn.py -d $d -i $i -h 45 -b 50 > logs/deep-$d-$i-45-50.log

            echo -e "\t\t$((2 * $i)) hidden neurons"
            python dnn.py -d $d -i $i -h $((2 * $i)) -b 1  > logs/deep-$d-$i-$((2 * $i))-1.log
            python dnn.py -d $d -i $i -h $((2 * $i)) -b 50 > logs/deep-$d-$i-$((2 * $i))-50.log
    done
done
