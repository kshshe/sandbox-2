import React from 'react'
import styled from 'styled-components'

type CheckboxProps = {
  checked: boolean
  label: string
  onChange: (value: boolean) => void
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label }) => {
  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  )
}
