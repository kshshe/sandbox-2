import React from 'react'
import styled from 'styled-components'

type SliderProps = {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  onChange,
  step = 1,
}) => {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(parseFloat(e.target.value))}
    />
  )
}
