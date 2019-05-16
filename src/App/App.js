//@ts-check
import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom"
import './App.css';
import FamilyTreeConstructor from '../FamilyTree'
import DeceasedSelector from '../DeceasedSelector/DeceasedSelector'
import useFamily from '../hooks/useFamily'

const App = () => {
  //TODO: use context
  const { family, revision, addSpouse, addChild, addParents } = useFamily()
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
        <Route path="/step-2" render={() => <DeceasedSelector family={family}/>} />
        <Route path="/step-3" render={() => <div>step3</div>} />
      </div>
    </Router>
  );
}

export default App;