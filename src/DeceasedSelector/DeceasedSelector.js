import React from 'react'
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from 'react-sortable-hoc'
import classNames from 'classnames'
import Button from '@material/react-button'
import MaterialIcon from '@material/react-material-icon'

import LinkButton from '../LinkButton'
import useDeceasedSelector from './useDeceasedSelector'

import '@material/react-material-icon/dist/material-icon.css'
import '@material/react-button/dist/button.css';
import './DeceasedSelector.css'


const DeceasedSelector = ({ family }) => {
  const [state, dispatch] = useDeceasedSelector(family.getMembers())
  const { deceased, alive, ignored } = state

  return (
    <div className="DeceasedSelector">
      <div>
        <p className="DeceasedSelector-header">Alive Memebers</p>
        <ul className="DeceasedSelector-members">
          {alive.map(m => (
            <li key={m} className="DeceasedSelector-member">
              <span>{m}</span>
              <Button
                onClick={() => dispatch({ type: 'move_to_dead', person: m })}
              >
                dead
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="DeceasedSelector-header">Deceased Members [Drag members to specify their death order]</p>
        <SortableDeceasedMembers
          onSortEnd={({ oldIndex, newIndex }) =>
            dispatch({ type: 'reorder_deceased_members', oldIndex, newIndex })
          }
          useDragHandle
        >
            {deceased.map((member, index) => (
              <DeceasedMember
                key={member}
                index={index}
                person={member}
                ignored={ignored}
                dispatch={dispatch}
              />
            ))}
        </SortableDeceasedMembers>
      </div>

      <div className="DeceasedSelector-footer">
        <LinkButton raised to="/step-1">Prev</LinkButton>
        <LinkButton raised to="/step-3">Next</LinkButton>
      </div>
    </div>
  )
}

export default DeceasedSelector


const DragHandle = sortableHandle(() => (
  <MaterialIcon className="DeceasedSelector-drag-handler" icon='menu' />
))

const SortableDeceasedMembers = sortableContainer(({ children }) => (
  <ul className="DeceasedSelector-members">
    {children}
  </ul>
))

const DeceasedMember = sortableElement(({ person, ignored, dispatch }) => {
  const isIgnored = ignored.includes(person)
  
  return (
    <li
      className={classNames(
        'DeceasedSelector-member',
        'DeceasedSelector-deceased-member',
        { 'DeceasedSelector-ignored': isIgnored }
      )}
    >
      <DragHandle />
      <span>{person}</span>
      {isIgnored ? (
        <Button
          onClick={() =>
            dispatch({ type: 'unignore_deceased_member', person })
          }
        >
          unignore
        </Button>
      ) : (
        <Button
          onClick={() =>
            dispatch({ type: 'ignore_deceased_member', person })
          }
        >
          ignore
        </Button>
      )}
      <Button
        onClick={() => dispatch({ type: 'move_to_alive', person })}
      >
        not dead
      </Button>
    </li>
  )
})