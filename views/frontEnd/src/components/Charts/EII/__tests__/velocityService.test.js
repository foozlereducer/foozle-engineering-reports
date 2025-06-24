
import { describe, it, vi, expect } from 'vitest';
import { fetchSprintVelocity, fetchCurrentSprint } from '@/components/Charts/EII/services/velocity.js';

describe('velocity.js', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches sprint velocity', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ sprintName: 'Sprint 12', velocity: 20 })
      })
    );

    const data = await fetchSprintVelocity('Sprint 12');
    expect(data.velocity).toBe(20);
  });

  it('throws on failed sprint velocity fetch', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false, statusText: 'Not Found' }));

    await expect(fetchSprintVelocity('Sprint X')).rejects.toThrow('Error fetching sprint velocity: Not Found');
  });

  it('fetches current sprint', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ sprintName: 'Sprint 13' })
      })
    );

    const data = await fetchCurrentSprint();
    expect(data.sprintName).toBe('Sprint 13');
  });

  it('throws on failed current sprint fetch', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false, statusText: 'Unauthorized' }));

    await expect(fetchCurrentSprint()).rejects.toThrow('Error fetching current sprint: Unauthorized');
  });
});
