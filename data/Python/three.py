from email.mime import application
from hashlib import algorithms_available
import io
from urllib import request
from flask import Flask, render_template, request, Response, jsonify, make_response, url_for, request, redirect
import numpy as np
import cppSortAlgorithms
import base64

from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure

import timeit
from typing import List

application = Flask(__name__)


@application.route("/", methods=["GET", "POST"])
def home():

    return render_template("base.html")


@application.route("/output", methods=["GET", "POST"])
def output():

    algorithms = request.json['algorithms']
    size = request.json['size']
    size = int(size)

    cpptime = ""
    pythontime = ""

    # put the algorithm here# The random array to be sorted
    randnums = np.random.randint(1, size+1, size)

    # The sorting algortims in c++, * use an if here for selection of the algorithm going to be used
    if algorithms == "Bubble":

        # cpp
        start1 = timeit.default_timer()
        SortedNumsCpp = cppSortAlgorithms.bubble_sort(randnums.astype(np.intc))
        end1 = (timeit.default_timer() - start1)*1000  # in milliseconds
        cpptime = f"{end1:.5f}"

        # python
        bubblearr = randnums.astype(np.intc).tolist()
        start2 = timeit.default_timer()
        SortedNumsPython = bubbleSort(bubblearr)
        end2 = (timeit.default_timer() - start2)*1000  # in milliseconds
        pythontime = f"{end2:.5f}"
