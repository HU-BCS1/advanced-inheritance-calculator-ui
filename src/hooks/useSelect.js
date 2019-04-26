//@ts-check
import { useState, useEffect } from 'react'

const useSelect = options => {
  const [value, setValue] = useState(options[0])
  const handleOnChange = evt => {
    let newValue = evt.target.value
    setValue(newValue)
  }

  useEffect(() => {
    setValue(options[0])
  }, [options])

  return {
    input: { value, onChange: handleOnChange },
    value,
    options
  }
}

export default useSelect