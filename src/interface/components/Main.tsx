import React from 'react'
import styled from 'styled-components'
import FPSStats from "react-fps-stats";
import { Group } from './Group'
import { Slider } from './Slider'
import { observer } from 'mobx-react-lite'
import store from '../store'
import { Checkbox } from './Checkbox'
import { MAX_SPEED } from '../../constants';
import { isInline } from '../../utils/isInline';

const Container = styled.div<{
  isDisabled: boolean
}>`
  position: fixed;
  bottom: 20px;
  left: 10px;
  z-index: 200;

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
  const inline = isInline()
  return (
    <>
      {!inline && <FPSStats top={5} />}
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
        {store.processTemperature && <Group title="Air temperature" value={`${store.baseTemperature}℃`}>
          <Slider
            min={-200}
            max={200}
            value={store.baseTemperature}
            onChange={(value) => {
              store.setProperty('baseTemperature', value)
            }}
          />
        </Group>}
        {store.processHumidity && <Group title="Air humidity" value={`${store.baseHumidity}%`}>
          <Slider
            min={0}
            max={100}
            value={store.baseHumidity}
            onChange={(value) => {
              store.setProperty('baseHumidity', value)
            }}
          />
        </Group>}
        {!inline && store.showMoreSettings && <>
          <Group title="Scale (bigger is faster)" value={`${store.scale}px`}>
            <Slider
              min={1}
              max={40}
              value={store.scale}
              onChange={(value) => {
                store.setProperty('scale', value)
              }}
            />
          </Group>
          <Group title="Game speed" value={store.speed === MAX_SPEED ? 'max' : `x${store.speed}`}>
            <Slider
              min={1}
              max={16}
              step={5}
              value={store.speed}
              onChange={(value) => {
                store.setProperty('speed', value)
              }}
            />
          </Group>
        </>}
        <Group>
          <Checkbox
            label="Realistic temperature"
            checked={store.processTemperature}
            onChange={(value) => {
              store.setProperty('processTemperature', value)
              if (!value) {
                store.setProperty('showTemperature', false)
              }
            }}
          />
        </Group>
        <Group>
          <Checkbox
            label="Process humidity (plants)"
            checked={store.processHumidity}
            onChange={(value) => {
              store.setProperty('processHumidity', value)
            }}
          />
        </Group>
        {store.showMoreSettings && <>
          <Group>
            <Checkbox
              label="Thermovision"
              checked={store.showTemperature}
              onChange={(value) => {
                store.setProperty('showTemperature', value)
                if (value) {
                  store.setProperty('processTemperature', true)
                }
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
              label="Debug"
              checked={store.debug}
              onChange={(value) => {
                store.setProperty('debug', value)
              }}
            />
          </Group>
        </>}
        <Group>
          <Checkbox
            label="Pause"
            checked={store.pause}
            onChange={(value) => {
              store.setProperty('pause', value)
            }}
          />
        </Group>
        <button onClick={() => store.setProperty('showMoreSettings', !store.showMoreSettings)}>
          {store.showMoreSettings ? 'Less' : 'More'} settings
        </button>
      </Container>
    </>
  )
})
