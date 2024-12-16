import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import StationList from '../components/StationList.vue';

describe('StationList.vue', () => {
  it('renders a list of stations', () => {
    const wrapper = mount(StationList, {
      props: {
        stations: [
          { name: 'Station A', country: 'Canada' },
          { name: 'Station B', country: 'USA' },
        ],
      },
    });
    const stationCards = wrapper.findAll('.station-card');
    expect(stationCards.length).toBe(2);
  });

  it('emits "playStation" when a station is clicked', async () => {
    const wrapper = mount(StationList, {
      props: {
        stations: [{ name: 'Station A', country: 'Canada' }],
      },
    });
    await wrapper.find('.station-card').trigger('click');
    expect(wrapper.emitted('playStation')[0][0]).toEqual({
      name: 'Station A',
      country: 'Canada',
    });
  });
});
