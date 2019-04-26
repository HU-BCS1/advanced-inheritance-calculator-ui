//@ts-check
import { useState } from 'react'

const useInput = defaultValue => {
  const [value, setValue] = useState(defaultValue)
  const handleOnChange = evt => {
    let newValue = evt.target.value
    setValue(newValue)
  }

  const handleReset = () => setValue(defaultValue)

  return {
    input: { value, onChange: handleOnChange },
    value,
    setValue,
    reset: handleReset
  }
}

export default useInput