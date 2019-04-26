//@ts-check
import * as d3 from 'd3'

export default function drawFamilyTree(rootElement, family, familyRoot, onNodeClick) {
  const data = {
    id: 'root',
    hidden: true,
    children: traverseFamily(family, familyRoot)
  }
  const siblings = getMarriages(family, familyRoot)

  const nodeWidth = 80
  const nodeHeight = 40

  const treeLayout = d3.tree()
    .nodeSize([nodeWidth + 40, nodeHeight + 60])
    .separation((a, b) => (a.data.hidden || b.data.hidden) ? 0.5 : 1)

  const root = d3.hierarchy(data)
  treeLayout(root)

  const allNodes = flatten(root)

  const minX = d3.min(allNodes.map(n => n.x)) - (nodeWidth/2 + 10)
  const maxX = d3.max(allNodes.map(n => n.x)) + (nodeWidth/2 + 10)
  const minY = d3.min(allNodes.map(n => n.y)) - (nodeHeight/2 + 10)
  const maxY = d3.max(allNodes.map(n => n.y)) + (nodeHeight/2 + 10)
  const width = maxX - minX
  const height = maxY - minY

  const svg = drawSvg(rootElement, minX, minY, width, height)
  drawLinks(svg, root.links())
  drawSiblingLinks(svg, siblings, allNodes)
  drawNodes(svg, root.descendants(), onNodeClick, nodeWidth, nodeHeight)
}

function drawSvg(rootElement, minX, minY, width, height) {
  d3.select("svg").remove();
  const svg = d3.select(rootElement)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `${minX} ${-minY} ${width} ${height}`)

  return svg
}

function drawLinks(svg, links) {
  svg.selectAll('.link')
    .data(links)
    .enter()
    .append('path')
    .classed('link', true)
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
    .attr('d', elbow)
}

function drawSiblingLinks(svg, links, allNodes) {
  svg.selectAll('.sibling-link')
    .data(links)
    .enter()
    .append('path')
    .attr('class', 'sibling-link')
    .attr('d', d => siblingLine(allNodes, d))
}

function drawNodes(svg, data, onNodeClick, nodeWidth, nodeHeight) {
  const nodes = svg.selectAll('.node')
    .data(data)
    .enter()

  nodes.append('rect')
    .attr('class', 'node')
    .attr('x', d => d.x - 40)
    .attr('y', d => d.y - 20)
    .attr('rx', 2)
    .attr('ry', 2)
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .attr('display', d => d.data.hidden ? 'none' : '')
    .attr('style', d => {
      if(d.data.color) return `stroke:${d.data.color}`
    })
    .on('click', d => onNodeClick(d))

  nodes.append('text')
    .text(d => d.data.name)
    .attr('x', d => d.x - (nodeWidth/2) + 5)
    .attr('y', d => d.y - 5)
    .attr('class', 'text')
    .call(wrap, nodeWidth - 10)
    .on('click', d => onNodeClick(d))

}

const elbow = d => {
  if(d.target.data.no_parent) return "M0,0L0,0"

  const diff = d.source.y - d.target.y
  const ny = d.target.y + diff * 0.5
  const points = [
    [d.target.x, d.target.y],
    [d.target.x, ny],
    [d.source.x, d.source.y]
  ]

  const lineGenerator = d3.line().curve(d3.curveStepAfter)
  return lineGenerator(points)
}

const siblingLine = (allNodes, d) => {
  const start = allNodes.find(n => d.source === n.data.id)
  const end = allNodes.find(n => d.target === n.data.id)
  const points = [
    [start.x, start.y],
    [end.x, end.y]
  ]

  const lineGenerator = d3.line().curve(d3.curveLinear)
  return lineGenerator(points)
}

const flatten = root => {
  const nodes = []
  const recurse = node => {
    if(node.children) node.children.forEach(recurse)
    nodes.push(node)
  }
  recurse(root)

  return nodes
}

// https://stackoverflow.com/a/24785497/5915221
function wrap(text, width) {
  text.each(function () {
    let text = d3.select(this)
    let words = text.text().split(/\s+/)
    let line = []
    let lineNumber = 0
    let lineHeight = 1.1 // ems
    let x = text.attr("x")
    let y = text.attr("y")
    let dy = 0 //parseFloat(text.attr("dy")),
    let tspan = text.text(null)
      .append("tspan")
      .attr("x", x)
      .attr("y", y)
      .attr("dy", dy + "em");

    for (const word of words) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }

  });
}

const traverseFamily = (f, root, depth = 0) => {
  const femaleColor = 'hotpink'
  const maleColor = 'steelblue'
  const getColor = person =>
    f.getGender(person) === 'male' ? maleColor : femaleColor

  const families = f.getSpouses(root).flatMap(spouse => {
    const children = f.getChildren(root, spouse)
    return [
      {
        id: `${root}-${spouse}`,
        hidden: true,
        no_parent: true,
        children: children.flatMap(child => traverseFamily(f, child, depth + 1))
      },
      { id: spouse, name: spouse, color: getColor(spouse), no_parent: true }
    ]
  })

  return [
    { id: root, name: root, color: getColor(root), no_parent: depth === 0 },
    ...families
  ]
}

const getMarriages = (f, root) => {
  return f.getDescendants(root).flatMap(s => {
    return f.getSpouses(s).map(t => ({ source: s, target: t }))
  })
}