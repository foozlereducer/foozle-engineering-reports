import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VelocityLineChart from '../VelocityLineChart.vue'

const mockVelocityData = [
  { sprint: 'Sprint 1', committed: 30, completed: 25 },
  { sprint: 'Sprint 2', committed: 40, completed: 38 },
]

describe('VelocityLineChart.vue', () => {
  beforeEach(() => {
  global.fetch = vi.fn((url) => {
      if (url.includes('/api/v1/getCurrentSprint')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ sprintName: 'Sprint 12' }),
        })
      }
      if (url.includes('/api/v1/getSprintVelocity')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ velocity: 35 }),
        })
      }
      return Promise.reject(new Error(`Unhandled fetch to ${url}`))
    })
  })


  it('renders the chart container', async () => {
    const wrapper = mount(VelocityLineChart, {
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.find('div.velocity-line-chart').exists()).toBe(true)
  })

  it('calls fetch on mount and populates chart data', async () => {
    const wrapper = mount(VelocityLineChart)
    await nextTick()
    // Wait for chart data to load
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/getCurrentSprint'))
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/getSprintVelocity'))
  })

  it('displays the Load Velocity button and updates data on click', async () => {
    const wrapper = mount(VelocityLineChart)
    await nextTick()

    // Fill inputs
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Sprint 1')
    await inputs[1].setValue('Sprint 2')

    // Clear previous calls for accurate assertion
    global.fetch.mockClear()

    // Trigger button click
    await wrapper.find('button').trigger('click')
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    const fetchCalls = global.fetch.mock.calls.map(call => call[0])
    expect(fetchCalls).toEqual(expect.arrayContaining([
      expect.stringContaining('Sprint%201'),
      expect.stringContaining('Sprint%202')
    ]))
  })

  it('defaults to current sprint when inputs are empty', async () => {
    const wrapper = mount(VelocityLineChart)

    // Clear previous fetch calls
    global.fetch.mockClear()

    await wrapper.find('button').trigger('click')
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/getCurrentSprint'))
  })

  it('does not fetch velocity data when sprint inputs are invalid', async () => {
    const wrapper = mount(VelocityLineChart)
    await nextTick()

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Sprint ABC')
    await inputs[1].setValue('Sprint XYZ')

    global.fetch.mockClear()

    await wrapper.find('button').trigger('click')
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    // It should not call getSprintVelocity at all
    const fetchCalls = global.fetch.mock.calls.map(call => call[0])
    const velocityCalls = fetchCalls.filter(url => url.includes('getSprintVelocity'))
    expect(velocityCalls.length).toBe(0)
  })

  it('loads only one sprint if endSprint is empty', async () => {
    const wrapper = mount(VelocityLineChart)
    await nextTick()

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Sprint 3')
    await inputs[1].setValue('')

    global.fetch.mockClear()

    await wrapper.find('button').trigger('click')
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    const fetchCalls = global.fetch.mock.calls.map(call => call[0])
    expect(fetchCalls).toEqual(expect.arrayContaining([
      expect.stringContaining('Sprint%203')
    ]))
  })

  it('handles fetch errors gracefully', async () => {
    global.fetch = vi.fn(() => Promise.resolve({
      ok: false,
      status: 500,
    }))

    const wrapper = mount(VelocityLineChart)
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    // Assuming you show some kind of error
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text().toLowerCase()).toContain('error')
  })

})
