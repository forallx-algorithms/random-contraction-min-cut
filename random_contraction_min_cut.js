/*
  @author Evgeniy Kuznetsov
  @date 12.3.2015
 */

// Contracts random edge
// @return {Object} contracted: Contracted node, edges: Final edges
function contractEdge(graph, edges, index){

  // choose random edge
  var edge = edges[index];
  var h = edge[0];
  var t = edge[1];

  var fundefined = function(e){ return e !== undefined };
  var mtails     = function(e){ return e == t ? h : e; };

  // remove edge from edges list
  edges[index] = undefined;
  edges = edges.filter(fundefined);

  for(var i in edges) edges[i] = edges[i].map(mtails);

  // replace all tails in linked edges by head
  for(var i=0; i < graph[t].length; i++){
    var cur = graph[t][i];
    graph[cur] = graph[cur].map(mtails);
  }

  // merge all tails edges to head node
  graph[h] = graph[h].concat(graph[t]);

  // remove tail edge from graph
  delete graph[t];

  // replace tail edge by head edge in head edge
  var i = graph[h].indexOf(t);
  if(i > -1){
    graph[h][i] = undefined;
    graph[h] = graph[h].filter(fundefined);
  }

  return {contracted: edge, edges: edges};

}

// Removes self loops
// @param {String} nodeKey
// @param {Graph} g
function removeSelfLoops(n, g, e){
  if(g[n]){
    g[n] = g[n].filter( function(e){ return e !== parseInt(n); } );
  }

  var slfilter = function(i){ return i[0]!=i[1]; };

  return e.filter(slfilter);
}

// Calculates edges from a graph
// @param {Graph} g
// @return {Array.<Edge>}
function calculateEdges(g){
  var acc = {};
  var edges = [];

  for(var head in g){
    var cur = g[head];

    for(var itail in cur){
      var edge = [parseInt(head), cur[itail]].sort(function(f,s){return f-s;});
      var vKey = edge.join(":");

      if(acc[vKey] === undefined){
        acc[vKey]=true;
        edges.push(edge);
      }
    }
  }

  return edges;
}

// Karger's algorithm
// @param {Graph} g
// @param {Graph} g
function kMinCut(g){
  var size = Object.keys(g).length;
  var edges = calculateEdges(g);

  if(size>2){
    while(Object.keys(g).length > 2){
      // contract
      var i = Math.floor(Math.random() * edges.length);
      var r = contractEdge(g, edges, i);
      edges = r.edges;

      // remove loops
      edges = removeSelfLoops(r.contracted[0], g, edges);
    }
  }

  return g;
}

var getSimpleGraph = function(){
  return {
    1: [2, 3],
    2: [1, 3],
    3: [1, 2]
  };
};

var getAdvancedGraph = function(){
  return {
    1: [2,3,4],
    2: [1,3,4],
    3: [1,2,4,6],
    4: [1,2,3,5],
    5: [4,6,7,8],
    6: [3,5,7,8],
    7: [5,6,8],
    8: [5,6,7]
  }
};


// section: Tests

console.log("Case 1 (calculate edges):", calculateEdges(getSimpleGraph()).toString()=="1,2,1,3,2,3", calculateEdges(getSimpleGraph()));

var fnTest1 = function(){
  var test = getAdvancedGraph();
  var ss = Object.keys(test).length;
  var cnode = contractEdge(test, calculateEdges(test));
  var ch = cnode[0];
  var ct = cnode[1];

  return test[ct] == undefined && ( Object.keys(test).length == ss-1 );
};
console.log("Case 2 (contract random edge)", fnTest1());

var fnTest2 = function(){
  var test = getSimpleGraph();
  var edges = calculateEdges(test);
  var sl = edges.length;

  edges.push([1,1]);

  test[1].push(1);

  edges = removeSelfLoops("1", test, edges);

  return test[1].indexOf(1)==-1 && sl == edges.length-1;
};
console.log("Case 3 (remove self loops)", fnTest2());
