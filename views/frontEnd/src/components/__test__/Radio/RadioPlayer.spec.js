import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import RadioPlayer from '../components/RadioPlayer.vue';

describe('RadioPlayer.vue', () => {
  it('renders station search and list components', () => {
    const wrapper = mount(RadioPlayer);
    expect(wrapper.findComponent({ name: 'StationSearch' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'StationList' }).exists()).toBe(true);
  });

  it('filters stations based on search query', async () => {
    const wrapper = mount(RadioPlayer);
    await wrapper.setData({
      stations: [
        { name: 'Station A', url_resolved: 'http://a.com' },
        { name: 'Station B', url_resolved: 'http://b.com' },
      ],
      searchQuery: 'Station A',
    });
    expect(wrapper.vm.filteredStations).toEqual([{ name: 'Station A', url_resolved: 'http://a.com' }]);
  });

  it('updates selected stream URL when a station is played', async () => {
    const wrapper = mount(RadioPlayer);
    const station = { name: 'Station A', url_resolved: 'http://a.com' };
    await wrapper.vm.playStation(station);
    expect(wrapper.vm.selectedStreamUrl).toBe('http://a.com');
  });
});
