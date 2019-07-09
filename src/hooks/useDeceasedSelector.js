import { useReducer } from 'react'
import arrayMove from 'array-move'

const useDeceasedSelector = members => {
  const initialState = { deceased: [], alive: members, ignored: [] }

  const reducer = (state, action) => {
    switch(action.type) {
      case 'move_to_dead':
        return {
          ...state,
          deceased: [...state.deceased, action.person],
          alive: state.alive.filter(p => p !== action.person)
        }
      case 'move_to_alive':
        return {
          ...state,
          deceased: state.deceased.filter(p => p !== action.person),
          alive: [...state.alive, action.person]
        }
      case 'ignore_deceased_member':
        return {
          ...state,
          ignored: [...state.ignored, action.person]
        }
      case 'unignore_deceased_member':
        return {
          ...state,
          ignored: state.ignored.filter(p => p !== action.person)
        }
      case 'reorder_deceased_members':
        return {
          ...state,
          deceased: arrayMove(state.deceased, action.oldIndex, action.newIndex)
        }
      default:
        throw Error(`unknown action type: ${action.type}`)
    }
  }

  return useReducer(reducer, initialState)
}

export default useDeceasedSelector