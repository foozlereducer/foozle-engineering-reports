import { mount } from '@vue/test-utils';
import { devices } from '../../composibles/devices';
import { deviceSize } from '../../composibles/deviceSize.js';
import { describe, expect, it } from 'vitest';


// Mock screen object
global.screen = {
  width: 1366, // Set to a valid width for testing purposes
};

describe('deviceSize composable', () => {
  it('returns expected values', async () => {
    const wrapper = mount({
      template: `
        <div>{{ sizes.browserWidth }}</div>
        <div>{{ sizes.deviceWidth }}</div>
        <div>{{ sizes.device.value }}</div>
      `,
      setup() {
        const sizes = deviceSize(devices);
        return { sizes };
      },
    });

    // Check initial values
    expect(wrapper.text()).toContain('1024'); // Browser width
    expect(wrapper.text()).toContain('1366'); // Device width
    expect(wrapper.text()).toContain('desktop'); // Device type

    // Simulate browser resize
    global.window.innerWidth = 600;
    window.dispatchEvent(new Event('resize'));

    // Wait for DOM to update
    await wrapper.vm.$nextTick();

    // Check updated values after resize
    expect(wrapper.text()).toContain('600'); // Browser width
    expect(wrapper.text()).toContain('phone'); // Device type
  });
});