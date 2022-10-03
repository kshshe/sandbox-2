import React from 'react'
import styled from 'styled-components'
import { Group } from './Group'
import { Slider } from './Slider'
import { observer } from 'mobx-react-lite'
import store from '../store'
import { Checkbox } from './Checkbox'

const Container = styled.div`
  position: fixed;
  bottom: 20px;
  left: 10px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 5px;
  border-radius: 4px;
  background: #eaeaea6e;
`

export const Main: React.FC = observer(() => {
  return (
    <Container>
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
      <Group title="Base temperature" value={`${store.baseTemperature}℃`}>
        <Slider
          min={-10}
          max={10}
          value={store.baseTemperature}
          onChange={(value) => {
            store.setProperty('baseTemperature', value)
          }}
        />
      </Group>
      <Group title="Thermovision">
        <Checkbox
          checked={store.showTemperature}
          onChange={(value) => {
            store.setProperty('showTemperature', value)
          }}
        />
      </Group>
      <Group title="No borders">
        <Checkbox
          checked={store.freeBorders}
          onChange={(value) => {
            store.setProperty('freeBorders', value)
          }}
        />
      </Group>
      <Group title="Pause">
        <Checkbox
          checked={store.pause}
          onChange={(value) => {
            store.setProperty('pause', value)
          }}
        />
      </Group>
    </Container>
  )
})
