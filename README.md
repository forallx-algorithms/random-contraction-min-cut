### About the contraction algorithm
The contraction algorithm , also known as Karger's algorithm, uses a randomization to contract edges in order to solve a min-cut problem of a graph.

### The algorithm
```
Foreach node v
  Keep track of S(v) contracted into v
  S(v) <- {v}
If G has only two nodes, v_1 and v_2, remaining
  Return cut (S(v_1), S(v_2))
Else
  e <- choose edge (u,v) uniformly at random
  G' <- G after contracting e
  x <- replace u and v
  S(x) <- S(u) U S(v)
  Recursively contract G'
```
