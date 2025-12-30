import { createSimulationEngine } from '../SimulationEngine'

test('simulation engine snapshot & command processing', () => {
  const engine = createSimulationEngine({ value: 0 })
  expect(engine.getSnapshot().state).toEqual({ value: 0 })

  engine.enqueueCommand({ id: '1', type: 'setState', payload: { value: 5 } })
  engine.step(16)
  const snap = engine.getSnapshot()
  expect(snap.state.value).toBe(5)
  expect(typeof engine.serialize()).toBe('string')
})



