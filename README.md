[![Netlify Status](https://api.netlify.com/api/v1/badges/6e374eb3-d341-4782-bcd0-fa1f2c5b962c/deploy-status)](https://app.netlify.com/sites/infallible-golick-cadc1f/deploys)

# Picture-Solver

I am trying to build a pure Frontend PWA that allows a user to scan Images of a Picture and provide a step by step
solution.

The Image formatting will be done by opencv in webassembly while the digit recognition may be handled with
Tensorflow.js.

## Todos

* make numberfield become input on click -> no reason for numpad
* create a python bakcend that can train a ML model
* if user changes numbers after scanning, send pictures + wrong value + right value to server
* create a backtracking algorithm to solve the sudoku
