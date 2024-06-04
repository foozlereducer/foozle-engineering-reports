import { reactive } from 'vue';

export const eventBus = reactive({
    showModal: false,
    modalMessage: '',
    modalStatus: ''
});
