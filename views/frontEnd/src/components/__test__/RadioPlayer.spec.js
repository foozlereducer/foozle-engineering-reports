import { describe, test, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import RadioPlayer from '../../views/RadioPlayer.vue';
import StationSearch from '../../components/StationSearch.vue';
import StationList from '../../components/StationList.vue';
import AudioControls from '../../components/AudioControls.vue';

// Mock WebSocket globally
class WebSocketMock {
    constructor(url) {
      this.url = url;
      this.readyState = 1; // OPEN
      this.onopen = null;
      this.onmessage = null;
      this.onerror = null;
      this.onclose = null;
    }
  
    send(data) {
      if (this.onmessage) {
        this.onmessage({ data: JSON.stringify({ response: 'mock response' }) });
      }
    }
  
    close() {
      if (this.onclose) {
        this.onclose();
      }
    }
  
    triggerOpen() {
      if (this.onopen) this.onopen();
    }
  
    triggerError(error) {
      if (this.onerror) this.onerror(error);
    }
  }
  
  beforeAll(() => {
    global.WebSocket = WebSocketMock; // Mock WebSocket globally
  });
  
  afterAll(() => {
    delete global.WebSocket; // Clean up the mock
  });
  
  describe('RadioPlayer.vue', () => {
    test('renders RadioPlayer and child components correctly', () => {
      const wrapper = mount(RadioPlayer);
  
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.findComponent(StationSearch).exists()).toBe(true);
      expect(wrapper.findComponent(StationList).exists()).toBe(true);
      expect(wrapper.findComponent(AudioControls).exists()).toBe(true);
  
      expect(wrapper.find('h1').text()).toBe('Radio Player');
    });
  
    test('AudioControls sets up WebSocket correctly', async () => {
      const wrapper = mount(RadioPlayer);
  
      const audioControls = wrapper.findComponent(AudioControls);
      expect(audioControls.exists()).toBe(true);
  
      // Check WebSocket mock connection
      const wsInstance = new global.WebSocket('wss://localhost:3000');
      wsInstance.triggerOpen();
  
      expect(wsInstance.url).toBe('wss://localhost:3000');
    });
    test('updates stations when stationsFetched event is emitted', async () => {
        const wrapper = mount(RadioPlayer);
    
        const mockStations = [
          { name: 'Station One', url_resolved: 'https://stream-one' },
          { name: 'Station Two', url_resolved: 'https://stream-two' },
        ];
    
        // Emit stationsFetched event from StationSearch child component
        await wrapper.findComponent(StationSearch).vm.$emit('stationsFetched', mockStations);
    
        const filteredStations = wrapper.vm.stations;
        expect(filteredStations).toEqual(mockStations);
      });
    
      test('updates search query when searchQueryUpdated event is emitted', async () => {
        const wrapper = mount(RadioPlayer);
    
        const query = 'rock';
    
        // Emit searchQueryUpdated event from StationSearch child component
        await wrapper.findComponent(StationSearch).vm.$emit('searchQueryUpdated', query);
    
        const searchQuery = wrapper.vm.searchQuery;
        expect(searchQuery).toBe(query);
      });

      test('filters stations based on search query', async () => {
        const wrapper = mount(RadioPlayer);
    
        // Set initial stations
        wrapper.vm.stations = [
          { name: 'Rock FM', url_resolved: 'https://rock.fm' },
          { name: 'Jazz FM', url_resolved: 'https://jazz.fm' },
        ];
    
        // Update search query to "rock"
        wrapper.vm.searchQuery = 'rock';
    
        // Verify filteredStations computed property
        const filtered = wrapper.vm.filteredStations;
        expect(filtered).toEqual([{ name: 'Rock FM', url_resolved: 'https://rock.fm' }]);
      });

      test('sets selectedStreamUrl when a station is played', async () => {
        const wrapper = mount(RadioPlayer);
    
        const station = { name: 'Rock FM', url_resolved: 'https://rock.fm' };
    
        // Call the playStation method
        wrapper.vm.playStation(station);
    
        expect(wrapper.vm.selectedStreamUrl).toBe('https://rock.fm');
      });

      test('passes selectedStreamUrl to AudioControls', async () => {
        const wrapper = mount(RadioPlayer);
    
        const station = { name: 'Jazz FM', url_resolved: 'https://jazz.fm' };
    
        // Call the playStation method
        wrapper.vm.playStation(station);
    
        // Wait for reactivity updates
        await nextTick();
    
        // Verify the prop passed to AudioControls
        const audioControls = wrapper.findComponent(AudioControls);
        expect(audioControls.props('streamUrl')).toBe('https://jazz.fm');
      });
  });