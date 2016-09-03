# binheap
a simple binheap i need to work as an npm module

module exports a function/class BinaryHeap which you call with a score function to get the new heap. 
right now scorefunction should return a numerical value but the compare step could easily be patched
to allow for any custom compare function. 

the returned heap is composed of
  .heap gives the contents
  .push will push an element and run the sink down function
  .pop will pop off the first element of the heap and have the heap adjust itself
  .remove takes the node you want to remove and removes it.
  .size is just a function to return the length of the heap.
  
if there is any interest i will add the needed custom scoring function to this library myself, feel free to create
an issue or email me. 
