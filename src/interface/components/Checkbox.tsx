import React from 'react'
import styled from 'styled-components'

type CheckboxProps = {
  checked: boolean
  onChange: (value: boolean) => void
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{checked ? 'On' : 'Off'}</span>
    </label>
  )
}
