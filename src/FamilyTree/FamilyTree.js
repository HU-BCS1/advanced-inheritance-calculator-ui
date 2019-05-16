//@ts-check
import React, { useState, useEffect, useRef, useMemo } from 'react'
import './FamilyTree.css'
import drawFamilyTree from './d3-familyTree'
import Controls from '../Controls/Controls'
import useInput from '../hooks/useInput';

const FamilyTree = ({ family, revision, addSpouse, addChild, addParents }) => {
  const rootElement = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const roots = useMemo(() => family.findRoots(), [revision])
  const selectedRoot = useInput(roots[0])

  useEffect(() => {
    const handleNodeClick = node => {
      setSelectedNode(node)
    }

    if(roots.length) {
      drawFamilyTree(
        rootElement.current,
        family,
        selectedRoot.value,
        handleNodeClick
      )
    }
  }, [revision, selectedRoot])

  return (
    <div className="FamilyTree">
      <div className="FamilyTree-svg-container" ref={rootElement} />
      <div className="FamilyTree-sidebar">
        <Controls
          family={family}
          selected={(selectedNode && selectedNode.data.name) || roots[0]}
          roots={roots}
          selectedRoot={selectedRoot}
          addSpouse={addSpouse}
          addChild={addChild}
          addParents={addParents}
        />
      </div>
    </div>
  )
}

export default FamilyTree