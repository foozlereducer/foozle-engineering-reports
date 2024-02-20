import { onUnmounted, onMounted, reactive, toRefs } from "vue";

export const deviceSize = (deviceSizes) => {
    const sizes = reactive ({
        browserWidth: window.innerWidth,
        deviceWidth: screen.width,
        device: 'desktop' // Default to desktop
    });

    const browserResized  = () => {
        sizes.browserWidth = window.innerWidth;
        sizes.deviceWidth = screen.width;
        sizes.device = getDevice();
    }
    console.log('screen.width:', screen.width);
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