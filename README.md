[![Netlify Status](https://api.netlify.com/api/v1/badges/6e374eb3-d341-4782-bcd0-fa1f2c5b962c/deploy-status)](https://app.netlify.com/sites/infallible-golick-cadc1f/deploys)

# Picture-Solver

I am trying to build a pure Frontend PWA that allows a user to scan Images of a Picture and provide a step by step
solution.

The Image formatting will be done by opencv in webassembly while the digit recognition may be handled with
Tensorflow.js.

## Todos

* [x] make numberfield become input on click -> no reason for numpad
* create a python bakcend that can train a ML model
* if user changes numbers after scanning, send pictures + wrong value + right value to server
* [x] create a backtracking algorithm to solve the sudoku

## Requirements

I as a User want to be able to scan Images efficiently and as correctly as possible.

* create a python backend that can train a ML model
* if user changes numbers after scanning, send pictures + wrong value + right value to server

I as a User want to use the application on my mobile device

* decide on fitting mobile layout
* make the application a pwa to reduce loading times

I as a User want to be able to step through a sudoku solution 1 by 1

* implement more algorithms for step by step solver
* decide on a format to step through 1 by 1
  * [ ] generate Solution and let the User step through it like chess.com analyzer
    


