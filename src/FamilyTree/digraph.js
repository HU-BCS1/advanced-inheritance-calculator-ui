//@ts-check

export default class Digraph {
  adjList = {}
  vertexLabels = {}

  addVertex = (v, labels = {}) => {
    this.adjList[v] = {}
    this.vertexLabels[v] = labels
    return v
  }

  addEdge = (v, w, labels = '') => {
    this.adjList[v][w] = labels
  }

  adj = v => {
    return this.adjList[v]
  }
}