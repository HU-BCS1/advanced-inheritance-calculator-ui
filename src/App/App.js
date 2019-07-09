//@ts-check
import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom"
import './App.css';
import FamilyTreeConstructor from '../FamilyTree'
import DeceasedSelector from '../DeceasedSelector/DeceasedSelector'
import InheritanceCalculator from '../InheritanceCalculator/InheritanceCalculator'
import useFamily from '../hooks/useFamily'
import useDeceasedSelector from '../hooks/useDeceasedSelector'

const App = () => {
  //TODO: use context
  const { family, revision, addSpouse, addChild, addParents } = useFamily()
  const [deceasedSelectorState, deceasedSelectorDispatch] = useDeceasedSelector(
    family.getMembers()
  )

  return (
    <Router>
      <div>
        <Route
          path={["/", "/step-1"]}
          exact
          render={() => (
            <FamilyTreeConstructor
              family={family}
              revision={revision}
              addSpouse={addSpouse}
              addChild={addChild}
              addParents={addParents}
            />
          )}
        />
        <Route
          path="/step-2"
          render={() => (
            <DeceasedSelector
              state={deceasedSelectorState}
              dispatch={deceasedSelectorDispatch}
              family={family}
            />
          )}
        />
        <Route
          path="/step-3"
          render={() => (
            <InheritanceCalculator
              deceasedSelectorState={deceasedSelectorState}
              family={family}
            />
          )}
        />
      </div>
    </Router>
  );
}

export default App;