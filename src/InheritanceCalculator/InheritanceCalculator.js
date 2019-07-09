//@ts-check
import React, { useMemo } from 'react'
import { mapValues } from 'lodash'
import { calculate } from '@hu-bcs1/islamic-inheritance-calculator'

const InheritanceCalculator = ({ family, deceasedSelectorState }) => {
  const { deceased, ignored } = deceasedSelectorState
  const notIgnored = deceased.filter(p => !ignored.includes(p))
  // const deceasedProperties = Array(notIgnored.length).fill(1000)

  const result = useMemo(() => {
    const result = notIgnored.map((p, i) => {
      return {
        deceased: p,
        heirs: calculateInheritance(
          p,
          family,
          removeFromHeirs([...ignored, ...notIgnored.slice(0, i)])
        )
      }
    })
    return withProperites(result)

  }, [])
  console.log('result', result)

  return (
    <>
      {result.map(({ deceased, heirs }) => (
        <ul key={deceased.name}>
          <li>
            <p>{deceased.name}: ${deceased.originalProperty} + ${deceased.inheritedProperty.toFixed(1)}</p>
            <ul>
              {heirs.map(h => (
                <li key={h.name}>{h.name} ({h.heirType}): {toPercentageStr(h.share)}</li>
              ))}
            </ul>
          </li>
        </ul>
      ))}
    </>
  )
}

export default InheritanceCalculator

const calculateInheritance = (p, family, filterHeirs) => {
  const heirs = filterHeirs({
    [`${family.getGender(p) === 'male' ? 'wife' : 'husband' }`]: family.getSpouses(p),
    son: family.getSons(p),
    daughter: family.getDaughters(p),
    father: family.getFather(p),
    mother: family.getMother(p),
    full_brother: family.getBrothers(p),
    full_sister: family.getSisters(p),
    paternal_brother: family.getBrothers(p, { sameMother: false }),
    paternal_sister: family.getSisters(p, { sameMother: false }),
    maternal_sibling: [
      ...family.getBrothers(p, { sameFather: false }),
      ...family.getSisters(p, { sameFather: false })
    ]
  })

  const heirsWithCount = mapValues(heirs, h => {
    if(Array.isArray(h)) { return h.length }
    if(h) { return 1 }
    else { return 0 }
  })

  // @ts-ignore
  const result = calculate(heirsWithCount).flatMap(r => {
    if(!Array.isArray(heirs[r.name])) {
      return {
        name: heirs[r.name],
        heirType: r.name,
        share: r.share
      }
    }

    return heirs[r.name].map(h => ({
        name: h,
        heirType: r.name,
        share: r.share.div(heirs[r.name].length)
    }))
  })

  return result
}

const withProperites = (result) => {
  return result.map(r => {
    return {
      ...r,
      deceased: {
        name: r.deceased,
        originalProperty: 1000,
        inheritedProperty: getInheritedProperty(result, r.deceased)
      }
    }
  })
}

const getInheritedProperty = (result, p) => {
  let inherited = 0
  const inheritedFrom = getWhomInheritedFrom(result, p)
  for(const d of inheritedFrom) {
    inherited += d.share.mul(getInheritedProperty(result, d.name) + 1000).valueOf()
    console.log(p, d.name, inherited)
  }
  return inherited
}

const getWhomInheritedFrom = (result, p) => {
  const inheritedFrom = []
  for(const r of result) {
    for(const h of r.heirs) {
      if(h.name === p) inheritedFrom.push({ name: r.deceased, share: h.share })
    }
  }
  return inheritedFrom
}

const removeFromHeirs = toBeRemoved => heirs => {
  return mapValues(heirs, h => {
    if(Array.isArray(h)) { return difference(h, toBeRemoved) }
    return toBeRemoved.includes(h) ? undefined : h
  })
}

const toPercentage = fr => {
  return fr.mul(100).valueOf()
}

const toPercentageStr = fr => {
  return `${toPercentage(fr).toFixed(2)}%`
}

// TODO: move this to utils
const difference = (array1, array2) => array1.filter(x => !array2.includes(x))