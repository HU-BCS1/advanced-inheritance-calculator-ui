//@ts-check
import React, { useState } from 'react'
import Modal from 'react-modal'
import LinkButton from '../LinkButton'

import Select from '@material/react-select';
import '@material/react-select/dist/select.css';

import TextField, { Input } from '@material/react-text-field';
import '@material/react-text-field/dist/text-field.css';

import Button from '@material/react-button';
import '@material/react-button/dist/button.css';

import useInput from '../hooks/useInput'
import './Controls.css'

Modal.setAppElement('#root')

const Controls = ({
  family,
  selected,
  addSpouse,
  addChild,
  addParents,
  roots,
  selectedRoot
}) => {
  const [spouseModal, setSpouseModal] = useState(false)
  const [childModal, setChildModal] = useState(false)
  const [parentsModal, setParentsModal] = useState(false)

  const handleAddSpouse = (spouseName) => {
    addSpouse(selected, spouseName)
    setSpouseModal(false)
  }

  const handleAddChild = (spouse, child, childGender) => {
    addChild(selected, spouse, child, childGender)
    setChildModal(false)
  }

  const handleAddParents = (fatherName, motherName) => {
    addParents(selected, fatherName, motherName)
    setChildModal(false)
  }

  return (
    <>
      <div>
        <p className="FamilyTree-sidebar-header">{selected}</p>
        <p><span className="Controls-dt">Father</span> {family.getFather(selected) || 'N/A'}</p>
        <p><span className="Controls-dt">Mother</span> {family.getMother(selected) || 'N/A'}</p>
        <p>
          <span className="Controls-dt">Families</span>
          {family.getSpouses(selected).length === 0 && 'N/A'}
          <ul className="Controls-spouses-list">
            {family.getSpouses(selected).map(spouse => (
              <li key={spouse}>
                <span>{spouse}</span>
                <ul>
                  {family.getChildren(selected, spouse).map(child => (
                    <li key={child}>{child}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </p>

        <div className="Controls-add-buttons">
          <Button outlined onClick={() => setSpouseModal(true)}>Add Spouse</Button>
          {family.getSpouses(selected).length > 0 && (
            <Button outlined onClick={() => setChildModal(true)}>Add Child</Button>
          )}
          <Button outlined onClick={() => setParentsModal(true)}>Add Parents</Button>
        </div>

      </div>

      <div className="Controls-footer">
        <Select outlined label="Root" {...selectedRoot.input}>
          {roots.map(root => (
            <option key={root}>{root}</option>
          ))}
        </Select>
        <LinkButton raised to="/step-2">Next</LinkButton>
      </div>

      <Modal
        isOpen={spouseModal}
        className="modal"
        overlayClassName="overlay"
      >
        <SpouseForm
          onAddSpouse={handleAddSpouse}
          onClose={() => setSpouseModal(false)}
        />
      </Modal>
      <Modal
        isOpen={childModal}
        className="modal"
        overlayClassName="overlay"
      >
        <ChildForm
          spouses={family.getSpouses(selected)}
          spousesGender={family.getGender(selected) === 'male' ? 'female' : 'male'}
          onAddChild={handleAddChild}
          onClose={() => setChildModal(false)}
        />
      </Modal>
      <Modal
        isOpen={parentsModal}
        className="modal"
        overlayClassName="overlay"
      >
        <ParentsForm
          onAddParents={handleAddParents}
          onClose={() => setParentsModal(false)}
        />
      </Modal>

    </>
  )
}

export default Controls


const ParentsForm = ({ onAddParents, onClose }) => {
  const fatherName = useInput('')
  const motherName = useInput('')

  return (
    <div className="modal-form">
      <p className="modal-title">Add Parents</p>
      <TextField outlined label="father"><Input {...fatherName.input} /></TextField>
      <TextField outlined label="mother"><Input {...motherName.input} /></TextField>
      <div className="modal-footer">
        <Button onClick={onClose}>close</Button>
        <Button
          onClick={() => onAddParents(fatherName.value, motherName.value)}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

const ChildForm = ({ spouses, spousesGender, onAddChild, onClose }) => {
  const childName = useInput('')
  const genders = ['male', 'female']
  const childGender = useInput(genders[0])
  const selectedSpouse = useInput(spouses[0])

  return (
    <div className="modal-form">
      <p className="modal-title">Add Child</p>
      <TextField outlined label="child"><Input {...childName.input} /></TextField>
      <Select outlined label="gender" {...childGender.input}>
        {genders.map(g => (
          <option key={g}>{g}</option>
        ))}
      </Select>
      <Select
        outlined
        label={spousesGender === 'female' ? 'mother' : 'father'}
        {...selectedSpouse.input}
      >
        {spouses.map(s => (
          <option key={s}>{s}</option>
        ))}
      </Select>
      <div className="modal-footer">
        <Button onClick={onClose}>close</Button>
        <Button
          onClick={() => onAddChild(selectedSpouse.value, childName.value, childGender.value)}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

const SpouseForm = ({ onAddSpouse, onClose }) => {
  const spouseName = useInput('')
  return (
    <div className="modal-form">
      <p className="modal-title">Add Spouse</p>
      <TextField outlined label="spouse"><Input {...spouseName.input} /></TextField>
      <div className="modal-footer">
        <Button onClick={onClose}>close</Button>
        <Button onClick={() => onAddSpouse(spouseName.value)}>Save</Button>
      </div>
    </div>
  )
}
