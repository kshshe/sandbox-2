import React from 'react'
import styled from 'styled-components'
import FPSStats from "react-fps-stats";
import { Group } from './Group'
import { Slider } from './Slider'
import { observer } from 'mobx-react-lite'
import store from '../store'
import { Checkbox } from './Checkbox'

const Container = styled.div<{
  isDisabled: boolean
}>`
  position: fixed;
  bottom: 20px;
  left: 10px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 5px;
  border-radius: 4px;
  background: #eaeaea6e;

  transition: opacity 0.2s ease-in-out;

  ${props => props.isDisabled && `
    pointer-events: none;
    opacity: 0.3;
  `}
`

export const Main: React.FC = observer(() => {
  return (
    <>
      <FPSStats />
      <Container isDisabled={store.isDrawing}>
        <Group title="Brush size" value={`${store.brushSize * 10}%`}>
          <Slider
            min={1}
            max={10}
            value={store.brushSize}
            onChange={(value) => {
              store.setProperty('brushSize', value)
            }}
          />
        </Group>
        <Group title="Game speed" value={`x${store.speed}`}>
          <Slider
            min={1}
            max={5}
            value={store.speed}
            onChange={(value) => {
              store.setProperty('speed', value)
            }}
          />
        </Group>
        <Group title="Air temperature" value={`${store.baseTemperature}℃`}>
          <Slider
            min={-200}
            max={200}
            value={store.baseTemperature}
            onChange={(value) => {
              store.setProperty('baseTemperature', value)
            }}
          />
        </Group>
        <Group>
          <Checkbox
            label="Dynamic water (beta)"
            checked={store.dynamicWater}
            onChange={(value) => {
              store.setProperty('dynamicWater', value)
            }}
          />
        </Group>
        <Group>
          <Checkbox
            label="Thermovision"
            checked={store.showTemperature}
            onChange={(value) => {
              store.setProperty('showTemperature', value)
            }}
          />
        </Group>
        <Group>
          <Checkbox
            label="No borders"
            checked={store.freeBorders}
            onChange={(value) => {
              store.setProperty('freeBorders', value)
            }}
          />
        </Group>
        <Group>
          <Checkbox
            label="Pause"
            checked={store.pause}
            onChange={(value) => {
              store.setProperty('pause', value)
            }}
          />
        </Group>
      </Container>
    </>
  )
})
