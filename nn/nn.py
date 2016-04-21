#!/usr/bin/env python3
import tensorflow as tf
import numpy as np
import time
import json
from random import shuffle
import sys, getopt

###################
#
# Maurice Prosper
# CS 4000
#
###################

try:
    opts, args = getopt.getopt(sys.argv[1:],"d:i:h:b:",["data-set=","input-neurons=","hidden-neurons=","batch-size="])
except getopt.GetoptError:
    sys.exit(2)

for opt, arg in opts:
    if opt in ("-i", "--input-neurons"):
        input_layer = int(arg)
    elif opt in ("-d", "--data-set"):
        dataSet = int(arg)
    elif opt in ("-h", "--hidden-neurons"):
        hidden_layer = int(arg)
    elif opt in ("-b", "--batch-size"):
        batch = int(arg)

####################
# Hyper Parameters #
####################

try:
    dataSet
except NameError:
    dataSet = 2

try:
    input_layer
except NameError:
    input_layer = 4

try:
    hidden_layer
except NameError:
    hidden_layer = 20

try:
    batch
except NameError:
    batch = 128

try:
    aggregate
except NameError:
    aggregate = False

iterations = 1
output_layer = 4
learning_rate = 0.05

# read from file
trX = []
trY = []
path = 'build/data-'+ str(dataSet) +'-'+ str(input_layer) +'.json'

with open(path) as file:
    print("Reading {:s} for {:d} input neurons".format(path, input_layer))
    jData = json.load(file)
    # shuffle(jData)
    for v in jData:
        trX.append(v.get('input'))
        trY.append(v.get('label'))

print("Using {:d} Training sets".format(len(trX)))

########################
# Build Neural Network #
########################

def init_weights(shape):
    return tf.Variable(tf.random_normal(shape, stddev=0.01))


def model(X, w_h, w_o):
    h = tf.nn.tanh(tf.matmul(X, w_h)) # this is a basic mlp, think 2 stacked logistic regressions
    return tf.matmul(h, w_o) # note that we dont take the softmax at the end because our cost fn does that for us

X = tf.placeholder("float", [None, input_layer])
Y = tf.placeholder("float", [None, output_layer])

w_h = init_weights([input_layer, hidden_layer])
w_o = init_weights([hidden_layer, output_layer])

py_x = model(X, w_h, w_o)

cost = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(py_x, Y)) # compute costs
train_op = tf.train.GradientDescentOptimizer(learning_rate).minimize(cost) # construct an optimizer
predict_op = tf.argmax(py_x, 1)

# Launch the graph in a session
with tf.Session() as sess:
    tf.initialize_all_variables().run()

    # Lets train over this set a few times
    for i in range(iterations):
        accuracy = []

        for start, end in zip(range(0, len(trX), batch), range(batch, len(trX), batch)):
            accuracy.append(np.mean(
                np.argmax(trY[start:end], axis=1) ==
                sess.run(predict_op, feed_dict={
                    X: trX[start:end],
                    Y: trY[start:end]
                })
            ))

            # Attempt this batch
            print("Test>> Iteration: {:d}\tBatch: {:d}\tStep: {:d}\tAccuracy: {:.7f}\tAggregate: {:.7f}".format(i, start//batch, i*(len(trX)//batch)+(start//batch), accuracy[start//batch], np.average(accuracy)))

            # Then train on it
            sess.run(train_op, feed_dict={X: trX[start:end], Y: trY[start:end]})

            # Log the train duration
            print("Train>> Iteration: {:d}\tBatch: {:d}\tStep: {:d}\tTimestamp: {:.6f}".format(i, start//batch, i*(len(trX)//batch)+(start//batch), time.time() ))
