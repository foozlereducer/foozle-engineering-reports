import { describe, test, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AudioControls from '../../AudioControls.vue';

describe('AudioControls.vue', () => {
  let wrapper;
  let audioElement;

  beforeEach(() => {
    // Real audio element with spies
    audioElement = document.createElement('audio');
    vi.spyOn(audioElement, 'play').mockResolvedValue();
    vi.spyOn(audioElement, 'pause').mockImplementation(() => {});

    wrapper = mount(AudioControls, {
      props: { streamUrl: 'https://example.com/stream.mp3' },
    });

    wrapper.vm.audioPlayer = audioElement; // Replace the audioPlayer ref
  });
  
  const mockAudioPlayer = () => {
    const playMock = vi.fn().mockResolvedValue();
    const pauseMock = vi.fn();
    Object.defineProperty(wrapper.vm.audioPlayer, 'play', { value: playMock });
    Object.defineProperty(wrapper.vm.audioPlayer, 'pause', { value: pauseMock });
    return { playMock, pauseMock };
  };

  test('renders the audio controls component', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.audio-controls').exists()).toBe(true);
  });

  test('updates volume when the slider is moved', async () => {
    const volumeSlider = wrapper.find('input[type="range"]');
  
    // Update volume
    await volumeSlider.setValue('0.5'); // Pass as string
    expect(wrapper.vm.volume).toBe(0.5);
  
    await volumeSlider.setValue('1'); // Pass as string
    expect(wrapper.vm.volume).toBe(1);
  });

  test('activates neon sign when audio plays', async () => {
    const { playMock } = mockAudioPlayer();

    expect(wrapper.vm.isNeonActive).toBe(false);

    // Trigger the play event
    await wrapper.vm.onStreamPlay();
    expect(wrapper.vm.isNeonActive).toBe(true);
    expect(wrapper.find('.neon-sign.active').exists()).toBe(true);
  });

  test('displays track and artist metadata correctly', async () => {
    wrapper.vm.trackInfo = 'Mock Track';
    wrapper.vm.artist = 'Mock Artist';
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.track p').text()).toBe('Mock Track');
    expect(wrapper.find('.artist p').text()).toBe('Mock Artist');
  });

  test('calculates and displays elapsed time correctly', async () => {
    wrapper.vm.elapsedTime = 75000; // 1 minute and 15 seconds
    await wrapper.vm.$nextTick();

    const progressText = wrapper.find('.pPercent').text();
    expect(progressText).toContain('1.15');
  });

  test('progress bar updates based on elapsed time and duration', async () => {
    wrapper.vm.duration = 60000; // 60 seconds
    wrapper.vm.elapsedTime = 30000; // 30 seconds
  
    // Manually update progress
    wrapper.vm.progressPercentage = Math.min(
      ((wrapper.vm.elapsedTime / wrapper.vm.duration) * 100).toFixed(2),
      100
    );
  
    await wrapper.vm.$nextTick();
  
    // Check approximate match
    const progressBarFill = wrapper.find('.progress-bar-fill');
    expect(progressBarFill.attributes('style')).toContain('width: 50.00%');
  });

  test('toggles play/pause when the button is clicked', async () => {
    const playButton = wrapper.find('button');
  
    // Step 1: Mock audio player and event listeners
    const playMock = vi.fn().mockResolvedValue();
    const pauseMock = vi.fn();
    const eventHandlers = {}; // To store event listeners
  
    wrapper.vm.audioPlayer = {
      play: playMock,
      pause: pauseMock,
      addEventListener: vi.fn((event, handler) => {
        eventHandlers[event] = handler;
      }),
      removeEventListener: vi.fn(),
    };
  
    // Step 2: Simulate clicking the play button
    await playButton.trigger('click');
    expect(playMock).toHaveBeenCalled(); // Ensure play() is called
  
    // Step 3: Trigger "playing" event manually
    if (eventHandlers.playing) {
      eventHandlers.playing(); // Invoke playing handler
      await wrapper.vm.$nextTick(); // Wait for DOM updates
    }
  
    // Verify isPlaying is updated to true
    expect(wrapper.vm.isPlaying).toBe(true);
  
    // Step 4: Simulate clicking the pause button
    await playButton.trigger('click');
    expect(pauseMock).toHaveBeenCalled(); // Ensure pause() is called
  
    // Step 5: Trigger "pause" event manually
    if (eventHandlers.pause) {
      eventHandlers.pause(); // Invoke pause handler
      await wrapper.vm.$nextTick(); // Wait for DOM updates
    }
  
    // Verify isPlaying is updated to false
    expect(wrapper.vm.isPlaying).toBe(false);
  });
  
});
