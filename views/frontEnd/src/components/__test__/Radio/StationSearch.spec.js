import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import StationSearch from '../components/StationSearch.vue';

describe('StationSearch.vue', () => {
  it('renders country and station inputs with search button', () => {
    const wrapper = mount(StationSearch);
    expect(wrapper.find('#searchCountry').exists()).toBe(true);
    expect(wrapper.find('#searchQuery').exists()).toBe(true);
    expect(wrapper.find('button.search-btn').exists()).toBe(true);
  });

  it('emits "stationsFetched" when search button is clicked', async () => {
    const wrapper = mount(StationSearch);
    await wrapper.find('button.search-btn').trigger('click');
    expect(wrapper.emitted('stationsFetched')).toBeTruthy();
  });

  it('emits "searchQueryUpdated" when search query changes', async () => {
    const wrapper = mount(StationSearch);
    const input = wrapper.find('#searchQuery');
    await input.setValue('Station A');
    expect(wrapper.emitted('searchQueryUpdated')).toBeTruthy();
  });
});
