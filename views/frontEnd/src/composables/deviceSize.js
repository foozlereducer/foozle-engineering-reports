/**
 * Create Device Size Compostable
 * 
 * Use like:
 * import { createDeviceSize } from '../composables/deviceSize.js';
 * import { devices } from '../composables/devices.js';
 * import { ref, onMounted, onUnUnmounted} from vue;
 * const sizes = ref(null); // set to reactive
 * onMounted(() => {
    sizes.value = createDeviceSize(devices); // initialize sizes on mount
    window.addEventListener('resize', () => {
      sizes.value = createDeviceSize(devices);
    });
  });
  onUnmounted(() => {
    window.removeEventListener('resize', () => {
      sizes.value = createDeviceSize(devices);
    });
  });
  * --------------------------------------------------
  * To use in a template is easier
  * <script setup>
  * import { createDeviceSize } from '../composables/deviceSize.js'
  * import {devices} from '../composables/devices.js'
  * </script>
  * <template>
  * const sizes = createDeviceSize(devices);
  * <h2>{{ sizes.browserWidth }} pixels: Browser</h2>
  * <h2>{{ sizes.deviceWidth  }} pixels: Device</h2>
  * <h2>{{ sizes.device.value }} type of Device </h2>
  *
  * <Phone v-if="sizes.device.value == 'phone'" />
  * <Tablet v-else-if="sizes.device.value == 'tablet'" />
  * <HomeView v-else />
  * </template>
 */
import { onUnmounted, onMounted, reactive, toRefs } from "vue";

export function createDeviceSize(deviceSizes) {
    const sizes = reactive({
        browserWidth: window.innerWidth,
        deviceWidth: screen.width,
        device: 'desktop' // Default to desktop
    });

    const browserResized = () => {
        sizes.browserWidth = window.innerWidth;
        sizes.deviceWidth = screen.width;
        sizes.device = getDevice();
    }

    const getDevice = () => {
        let type = 'desktop'; // Default to desktop

        if (window.innerWidth <= deviceSizes.phone.size) {
            type = deviceSizes.phone.type;
        } else if (window.innerWidth < deviceSizes.desktop.size) {
            type = deviceSizes.tablet.type;
        }

        return type;
    }

    onMounted(() => {
        window.addEventListener('resize', browserResized)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', browserResized);
    })

    return {
        ...toRefs(sizes)
    }
}
