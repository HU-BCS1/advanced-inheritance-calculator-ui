//@ts-check
import { useState, useEffect, useRef } from 'react'
import Family from './family'

const useFamily = () => {
  const f = useRef(new Family())
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    f.current.addMember('sh omar')
    setRevision(current => current + 1)
  }, [])

  const family = f.current
  return {
    family,
    revision,
    addSpouse: (person, spouse) => {
      const spouseGender =
        family.getGender(person) === 'male' ? 'female' : 'male'

      family.addMember(spouse, spouseGender)
      family.addSpouse(person, spouse)
      setRevision(current => current + 1)
    },
    addChild: (parent1, parent2, child, childGender) => {
      family.addMember(child, childGender)
      family.addChildren(parent1, parent2, [child])
      setRevision(current => current + 1)
    },
    addParents: (child, father, mother) => {
      family.addMember(father, 'male')
      family.addMember(mother, 'female')
      family.addSpouse(father, mother)
      family.addParents(child, father, mother)
      setRevision(current => current + 1)
    }
  }
}

export default useFamily