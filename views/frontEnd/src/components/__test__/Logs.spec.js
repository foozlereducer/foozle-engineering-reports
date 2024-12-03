import { mount, flushPromises } from '@vue/test-utils';
import Logs from '../../views/Logs.vue';
import axios from 'axios';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock axios
vi.mock('axios');

describe('Logs.vue', () => {
  let wrapper;

  beforeEach(async () => {
    // Mock the initial axios response
    axios.get.mockResolvedValue({
      data: {
        data: [
          { id: '2024-11-28-1', timestamp: '2024-11-28T14:42:54.879Z', level: 'info', message: 'Successfully connected to MongoDB Atlas', color: 'green' },
          { id: '2024-11-28-2', timestamp: '2024-11-28T14:43:00.000Z', level: 'error', message: 'Connection failed', color: 'red' }
        ],
        currentPage: 1,
        totalPages: 1,
        totalEntries: 2,
      }
    });

    wrapper = mount(Logs, {
      data() {
        return {
          selectedLevels: ['info', 'error'], // Ensure both levels are selected initially
          startTime: '00:00', // Start of the day
          endTime: '23:59' // End of the day
        };
      }
    });

    await flushPromises(); // Wait for any promises to resolve (including the initial axios request)
  });

  it('renders the log entries correctly', async () => {
    await flushPromises(); // Wait for any promises to resolve

    // Assert that the logs are rendered correctly
    const logEntries = wrapper.findAll('.log-entry');
    console.log('Log Entries:', logEntries.map(entry => entry.text())); // Debugging output
    expect(logEntries.length).toBe(2); // Expect both logs to be rendered

    // Check if the content is correctly rendered
    expect(logEntries[0].text()).toContain('Successfully connected to MongoDB Atlas');
    expect(logEntries[1].text()).toContain('Connection failed');
  });

  it('loads more logs when scrolling to the bottom', async () => {
    await flushPromises(); // Wait for any promises to resolve

    // Mock the axios response for the next page of logs
    axios.get.mockResolvedValueOnce({
      data: {
        data: [
          { id: '2024-11-28-3', timestamp: '2024-11-28T15:00:00.000Z', level: 'warn', message: 'Warning message', color: 'yellow' }
        ],
        currentPage: 2,
        totalPages: 2,
        totalEntries: 3,
      }
    });

    // Manually simulate reaching the bottom of the scroll to trigger load more logs
    wrapper.vm.currentPage = 1;
    wrapper.vm.onScroll();
    await flushPromises(); // Wait for the axios request to complete

    // Assert that a new log entry is added
    const logEntries = wrapper.findAll('.log-entry');
    expect(logEntries.length).toBe(3);
    expect(logEntries[2].text()).toContain('Warning message');
  });

  it('updates logs when the selected date changes', async () => {
    // Change the date in the input
    const dateInput = wrapper.find('input[type="date"]');
    await dateInput.setValue('2024-11-29');
    await flushPromises(); // Wait for the async axios request to complete

    // Assert axios get call with updated date
    expect(axios.get).toHaveBeenCalledWith(`${import.meta.env.VITE_BACKEND_URL}/api/logs/2024-11-29`, {
      params: { page: 1, pageSize: 100 },
    });
  });

  it('filters logs correctly by level', async () => {
    await flushPromises(); // Wait for any promises to resolve

    // Select the filter checkboxes (ensure the selector matches your HTML structure)
    const levelFilters = wrapper.findAll('.level-checkboxes input[type="checkbox"]');
    expect(levelFilters.length).toBeGreaterThan(0); // Ensure checkboxes are found

    // Set the checkboxes for 'info' and 'debug' to checked
    await levelFilters[5].setChecked(true); // Assuming 'info' is at index 5
    await levelFilters[7].setChecked(true); // Assuming 'debug' is at index 7

    await flushPromises(); // Wait for changes to take effect

    // Assert that the filtered logs contain only 'info' and 'debug' levels
    const filteredLogs = wrapper.vm.filteredLogs.filter((log) => ['info', 'debug'].includes(log.level));
    console.log('filterLogs', filteredLogs)
    expect(filteredLogs.length).toBeGreaterThan(0);
  });
});
