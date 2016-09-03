###

  Tyler Anderson 2011-2015

###

class BinaryHeap
  constructor: (score_func) ->
    @heap = []
    @scoreFunction = score_func
  
  push: (element) ->
    @heap.push element
    @sinkDown @heap.length - 1
    true

  pop: ->
    result = @heap[0]
    end = @heap.pop()
    if @heap.length > 0
      @heap[0] = end
      @bubbleUp 0
    result

  remove: (node) ->
    i = @heap.indexOf(node)
    end = @heap.pop()
    if i isnt @heap.length - 1
      @heap[i] = end
      if @scoreFunction(end) < @scoreFunction(node)
        @sinkDown i
      else
        @bubbleUp i
    true

  size: ->
    @heap.length

  rescoreElement: (node) ->
    @sinkDown @heap.indexOf(node)

  sinkDown: (n) ->
    element = @heap[n]
    while n > 0
      parentN = ((n + 1) >> 1) - 1
      parent = @heap[parentN]
      if @scoreFunction(element) < @scoreFunction(parent)
        @heap[parentN] = element
        @heap[n] = parent
        n = parentN
        true
      else
        break
    true

  bubbleUp: (n) ->
    length = @heap.length
    element = @heap[n]
    elemScore = @scoreFunction(element)
    loop
      child2N = (n + 1) << 1
      child1N = child2N - 1
      swap = null
      if child1N < length
        child1 = @heap[child1N]
        child1Score = @scoreFunction(child1)
        swap = child1N  if child1Score < elemScore
      if child2N < length
        child2 = @heap[child2N]
        child2Score = @scoreFunction(child2)
        swap = child2N  if child2Score < (if swap is null then elemScore else child1Score)
      if swap isnt null
        @heap[n] = @heap[swap]
        @heap[swap] = element
        n = swap
        true
      else
        break
    true

module.exports = (score_function) ->
    new BinaryHeap(score_function)
