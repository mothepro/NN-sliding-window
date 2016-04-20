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
	opts, args = getopt.getopt(sys.argv[1:],"d:i:",["data-set=","input-neurons="])
except getopt.GetoptError:
	sys.exit(2)

for opt, arg in opts:
	if opt in ("-i", "--input-neurons"):
		input_layer = int(arg)
	elif opt in ("-d", "--data-set"):
		dataSet = int(arg)

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
	input_layer = 20

iterations = 100
batch = 128
hidden_layer = 45 # int(input_layer * 1.5)
output_layer = 4
learning_rate = 0.05

# read from file
trX = []
trY = []
teX = []
teY = []
path = 'build/data-'+ str(dataSet) +'-'+ str(input_layer) +'.json'

with open(path) as file:
	print("Reading {:s} for {:d} input neurons".format(path, input_layer))
	jData = json.load(file)
	shuffle(jData)
	for v in jData:
		trX.append(v.get('input'))
		trY.append(v.get('label'))

# Split training & test sets
size = int(len(trX) * .8)

teX = trX[size:]
teY = trY[size:]
trX = trX[:size]
trY = trY[:size]

print("Using {:d} Training sets and {:d} Test sets".format(len(trX), len(teX)))

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

w_h = init_weights([input_layer, hidden_layer]) # create symbolic variables
w_o = init_weights([hidden_layer, output_layer])

py_x = model(X, w_h, w_o)

cost = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(py_x, Y)) # compute costs
train_op = tf.train.GradientDescentOptimizer(learning_rate).minimize(cost) # construct an optimizer
predict_op = tf.argmax(py_x, 1)

# Launch the graph in a session
with tf.Session() as sess:
	tf.initialize_all_variables().run()

	# Test with the untrained NN
	print("Guess>> Accuracy: {:.7f}".format(np.mean(np.argmax(teY, axis=1) == sess.run(predict_op, feed_dict={X: teX, Y: teY}))))

	# Lets train over this set a few times
	for i in range(iterations):
		for start, end in zip(range(0, len(trX), batch), range(batch, len(trX), batch)):
			sess.run(train_op, feed_dict={X: trX[start:end], Y: trY[start:end]})
			print("Train>> Iteration: {:d}\tBatch: {:d}\tStep: {:d}\tTimestamp: {:.6f}".format(i, start//batch, i*(len(trX)//batch)+(start//batch), time.time() ))
		print("Test>> Iteration: {:d}\tAccuracy: {:.7f}".format(i, np.mean(np.argmax(teY, axis=1) == sess.run(predict_op, feed_dict={X: teX, Y: teY}))))
