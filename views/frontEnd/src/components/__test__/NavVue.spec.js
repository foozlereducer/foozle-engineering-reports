import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Nav from '../Nav.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '../../stores/authStore.js';

vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    isAuthenticated: vi.ref(false),
    isMobile: vi.ref(false),
    setIsMobile: vi.fn(),
  })),
}));

describe('Nav.vue', () => {
  let wrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
    wrapper = mount(Nav, {
      global: {
        stubs: {
          Auth: true, // Stub the Auth component
          'router-link': true, // Stub the router-link component
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('shows navigation items when authenticated', async () => {
    const authStore = useAuthStore();
    authStore.isAuthenticated = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.navigation li').length).toBeGreaterThan(0);
  });

  it('hides navigation items when not authenticated', async () => {
    const authStore = useAuthStore();
    authStore.isAuthenticated = false;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.navigation').exists()).toBe(false);
  });

  it('toggles mobile navigation on click', async () => {
    await wrapper.find('.icon i').trigger('click');
    expect(wrapper.find('.dropdown-nav').isVisible()).toBe(true);
  });

  it('activates mobile navigation when window width is 480px or below', async () => {
    // Directly set isMobile to true instead of simulating window resize
    const authStore = useAuthStore();
    authStore.isMobile = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.navigation').exists()).toBe(false);
    expect(wrapper.find('.fa-bars').exists()).toBe(true);
  });
});

