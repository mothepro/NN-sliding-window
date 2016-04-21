#!/bin/bash
cd "$(dirname "$0")" # working directory
cd ../

mkdir -p logs/ build/
trash logs/* build/*

for d in `seq 1 2`;
do
    echo Dataset ${d}
    for i in `seq 4 9`;
    do
        echo Building sliding window of size ${i}
        node builder.js --one-hot -s ${i} -i assets/data-${d}.txt -o build/data-${d}-%.json

        let ih=$(($i + $i / 2)) # i * 1.5
        
        echo -e "\tRunning Neural Network with ${i} input neurons"
            echo -e "\t\t45 hidden neurons"
            python nn/nn.py -d ${d} -i ${i} -h 45 -b 1  > logs/nn-${d}-${i}-45-1.log
            python nn/nn.py -d ${d} -i ${i} -h 45 -b 50 > logs/nn-${d}-${i}-45-50.log

            echo -e "\t\t${ih} hidden neurons"
            python nn/nn.py -d ${d} -i ${i} -h ${ih} -b 1  > logs/nn-${d}-${i}-${ih}-1.log
            python nn/nn.py -d ${d} -i ${i} -h ${ih} -b 50 > logs/nn-${d}-${i}-${ih}-50.log

        echo -e "\tRunning Deep Neural Network with ${i} input neurons"
            echo -e "\t\t45 hidden neurons"
            python nn/dnn.py -d ${d} -i ${i} -h 45 -b 1  > logs/deep-${d}-${i}-45-1.log
            python nn/dnn.py -d ${d} -i ${i} -h 45 -b 50 > logs/deep-${d}-${i}-45-50.log

            echo -e "\t\t${ih} hidden neurons"
            python nn/dnn.py -d ${d} -i ${i} -h ${ih} -b 1  > logs/deep-${d}-${i}-${ih}-1.log
            python nn/dnn.py -d ${d} -i ${i} -h ${ih} -b 50 > logs/deep-${d}-${i}-${ih}-50.log
    done
done
