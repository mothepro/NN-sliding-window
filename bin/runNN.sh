#!/bin/bash

trash logs/*.log

for d in `seq 1 2`;
do
    echo Dataset $d
    for i in `seq 4 9`;
    do
#        echo Building sliding window of size $i
#        node builder.js --one-hot -i ../assets/data-$d.txt

        echo Running Neural Network with $i input neurons
        python nn.py -d $d -i $i -h 45 > logs/nn-$d-$i.log

        echo Running Deep Neural Network with $i input neurons
        python dnn.py -d $d -i $i -h 45 > logs/deep-$d-$i.log
    done
done
