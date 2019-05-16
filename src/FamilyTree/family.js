// @ts-check
import Graph from './digraph'

// TODO: add input checks
export default class Family {
  f = new Graph()

  constructor(members = []) {
    for(const member of members) {
      this.addMember(member)
    }
  }

  addMember = (name, gender = 'male') => {
    this.f.addVertex(name, { gender })
  }

  getGender = person => this.f.vertexLabels[person].gender

  getMembers = () =>
    Object.keys(this.f.adjList)

  findRoots = () =>
    this.getMembers().filter(person => this.isRoot(person))

  isRoot = person =>
    this.getParents(person).length === 0

  getDescendants = root => {
    const list = [root]
    const queue = []
    queue.push(root)
    while(queue.length !== 0) {
      const root = queue.pop()
      for(const child of this.getChildren(root)) {
        queue.push(child)
        list.push(child)
      }
    }
    return list
  }

  getDirectRelatives = person => {
    const relatives = this.f.adj(person)
    return Object.keys(relatives).map(r => ({ name: r, relation: relatives[r] }))
  }

  filterByRelation = relation => person => person.relation === relation

  getParents = person =>
    this.getDirectRelatives(person)
      .filter(this.filterByRelation('parent'))
      .map(pick('name'))

  getFather = person => {
    const parents = this.getParents(person)
    return parents.find(parent => this.getGender(parent) === 'male')
  }

  getMother = person => {
    const parents = this.getParents(person)
    return parents.find(parent => this.getGender(parent) === 'female')
  }

  getChildren = (person1, person2) => {
    if(person2) {
      return intersection(this.getChildren(person1), this.getChildren(person2))
    }

    return this.getDirectRelatives(person1)
      .filter(this.filterByRelation('child'))
      .map(pick('name'))
  }

  getSpouses = person =>
    this.getDirectRelatives(person)
      .filter(this.filterByRelation('spouse'))
      .map(pick('name'))

  addParents = (childID, parent1ID, parent2ID) => {
    this.f.addEdge(parent1ID, childID, 'child')
    this.f.addEdge(childID, parent1ID, 'parent')

    if(parent2ID) {
      this.f.addEdge(parent2ID, childID, 'child')
      this.f.addEdge(childID, parent2ID, 'parent')
    }
  }

  addChildren = (parent1ID, parent2ID, childrenIDs) => {
    for(const childID of childrenIDs) {
      this.f.addEdge(parent1ID, childID, 'child')
      this.f.addEdge(childID, parent1ID, 'parent')

      if(parent2ID) {
        this.f.addEdge(parent2ID, childID, 'child')
        this.f.addEdge(childID, parent2ID, 'parent')
      }
    }
  }

  addSpouse = (person1, person2) => {
    this.f.addEdge(person1, person2, 'spouse')
    this.f.addEdge(person2, person1, 'spouse')
  }
}

const pick = key => obj => obj[key]

const intersection = (array1, array2) =>
  array1.filter(value => array2.includes(value))

/*

usage
=====

const f = new Family([
  'sh omar',
  'barni',
  'ali',
  'khadijo hasan',
  'mohamoud osman',
  'halima',
  'hassan',
  'ramlo',
  'fuaad',
  'safiyo macalin',
  'yusuf',
  'ahmed',
  'rowdo',
  'abdihadi',
  'khalid',
  'adnan',
])

f.addSpouse('sh omar', 'barni')
f.addChildren('sh omar', 'barni', ['ali', 'halima', 'hassan'])
f.addSpouse('ali', 'khadijo hasan')
f.addSpouse('halima', 'mohamoud osman')
f.addChildren('halima', 'mohamoud osman', ['fuaad'])
f.addChildren('hassan', 'ramlo', ['yusuf', 'ahmed'])
f.addSpouse('fuaad', 'safiyo macalin')
f.addChildren('fuaad', 'safiyo macalin', ['rowdo', 'abdihadi', 'khalid', 'adnan'])

*/