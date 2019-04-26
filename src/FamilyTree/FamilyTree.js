//@ts-check
import React, { useState, useEffect, useRef, useMemo } from 'react'
import './FamilyTree.css'
import drawFamilyTree from './d3-familyTree'
import Controls from '../Controls/Controls'
import useFamily from './useFamily'
import useSelect from '../hooks/useSelect'

const FamilyTree = () => {
  const rootElement = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const { family, revision, addSpouse, addChild, addParents } = useFamily()
  const roots = useMemo(() => family.findRoots(), [revision])
  const selectedRoot = useSelect(roots)

  useEffect(() => {
    const handleNodeClick = node => {
      setSelectedNode(node)
    }

    if(roots.length) {
      drawFamilyTree(
        rootElement.current,
        family,
        selectedRoot.value || roots[0],
        handleNodeClick
      )
    }
  }, [revision, selectedRoot])

  return (
    <div className="FamilyTree">
      <div className="FamilyTree-svg-container" ref={rootElement} />
      <div className="FamilyTree-sidebar">
        {selectedNode && (
          <Controls
            key={selectedNode.data.name + revision}
            family={family}
            selected={selectedNode.data.name}
            roots={roots}
            selectedRoot={selectedRoot}
            addSpouse={addSpouse}
            addChild={addChild}
            addParents={addParents}
          />
        )}
      </div>
    </div>
  )
}

export default FamilyTree