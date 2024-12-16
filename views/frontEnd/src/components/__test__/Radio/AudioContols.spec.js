import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import AudioControls from '../components/AudioControls.vue';

describe('AudioControls.vue', () => {
  it('renders play/pause button and volume slider', () => {
    const wrapper = mount(AudioControls, {
      props: { streamUrl: 'http://example.com/stream' },
    });
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('input.volume-slider').exists()).toBe(true);
  });

  it('toggles play/pause state when button is clicked', async () => {
    const wrapper = mount(AudioControls);
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('i').classes()).toContain('fa-pause');
  });

  it('updates volume when slider is moved', async () => {
    const wrapper = mount(AudioControls);
    const volumeSlider = wrapper.find('input.volume-slider');
    await volumeSlider.setValue(0.5);
    expect(volumeSlider.element.value).toBe('0.5');
  });

  it('shows progress bar with correct width', async () => {
    const wrapper = mount(AudioControls);
    wrapper.setData({ progressPercentage: 50 });
    const progressBar = wrapper.find('.progress-bar-fill');
    expect(progressBar.attributes('style')).toContain('width: 50%');
  });
});

describe('AudioControls.vue - WebSocket integration', () => {
    it('receives metadata updates from WebSocket and updates track info', () => {
      // Mock WebSocket
      global.WebSocket = vi.fn(() => ({
        onopen: vi.fn(),
        onmessage: vi.fn((event) => {
          const data = JSON.stringify({ currentTrack: 'Test Track', artist: 'Test Artist' });
          event({ data });
        }),
        close: vi.fn(),
      }));
  
      const wrapper = mount(AudioControls);
      wrapper.vm.setupWebSocket({ url_resolved: 'http://example.com/stream' });
  
      // Simulate WebSocket message
      wrapper.vm.onMessage({
        data: JSON.stringify({ currentTrack: 'Test Track', artist: 'Test Artist' }),
      });
  
      expect(wrapper.vm.trackInfo).toBe('Test Track');
      expect(wrapper.vm.artist).toBe('Test Artist');
    });
  
    it('handles WebSocket errors gracefully', () => {
      global.WebSocket = vi.fn(() => ({
        onopen: vi.fn(),
        onerror: vi.fn((event) => {
          console.error('WebSocket error:', event.message);
        }),
        close: vi.fn(),
      }));
  
      const wrapper = mount(AudioControls);
      expect(() => {
        wrapper.vm.setupWebSocket({ url_resolved: 'http://example.com/stream' });
      }).not.toThrow();
    });
  });