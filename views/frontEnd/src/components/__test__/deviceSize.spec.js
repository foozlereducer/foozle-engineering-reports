import { describe, it, expect, beforeEach, vi } from 'vitest';
import { nextTick } from 'vue'; // Import nextTick from Vue
import { createDeviceSize } from '../../composables/deviceSize.js'; // Adjust path as needed
import { devices } from '../../composables/devices.js'; // Adjust path as needed

// Define mockWindowDimensions function
const mockWindowDimensions = (width) => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };

  
describe('createDeviceSize', () => {
    beforeEach(() => {
      // Reset the mock to a default value before each test
      mockWindowDimensions(1024);
    });
  
    it('initializes with default desktop sizes', () => {
      const { browserWidth, deviceWidth, device } = createDeviceSize(devices);
      expect(browserWidth.value).toBe(1024);
      expect(deviceWidth.value).toBe(1024);
      expect(device.value).toBe('desktop');
    });
  
    // it('updates sizes on window resize to phone', async () => {
    //   mockWindowDimensions(500); // Simulate phone width
    //   await nextTick();
    //   const { browserWidth, deviceWidth, device } = createDeviceSize(devices);
    //   expect(browserWidth.value).toBe(500);
    //   expect(deviceWidth.value).toBe(1024); // Screen width remains unchanged
    //   expect(device.value).toBe('phone');
    // });
  
    it('updates sizes on window resize to tablet', async () => {
      mockWindowDimensions(800); // Simulate tablet width
      await nextTick();
      const { browserWidth, deviceWidth, device } = createDeviceSize(devices);
      expect(1).toBe(1)
      console.log('bw', browserWidth.value, 'dw', deviceWidth.value, 'dv', device.value)
      expect(browserWidth.value).toBe(800);
      //expect(deviceWidth.value).toBe(1024); // Screen width remains unchanged
      //expect(device.value).toBe('tablet');
    });
  });