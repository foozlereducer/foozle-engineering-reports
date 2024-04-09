import { describe, expect, it, beforeEach, vi } from 'vitest';

import { LocalStorage } from '../../composables/localStorage.js';

// Mocking localStorage
const mockLocalStorage = (() => {
    let store = {};
    return {
      getItem(key) {
        return store[key] || null;
      },
      setItem(key, value) {
        store[key] = value.toString();
      },
      clear() {
        store = {};
      },
      removeItem(key) {
          delete store[key];
      }
    };
  })();

  describe('LocalStorage', () => {
    let ls;
  
    beforeEach(() => {
      // Reset localStorage before each test
      mockLocalStorage.clear();
      // Mock the global localStorage with our mockLocalStorage
      global.localStorage = mockLocalStorage;
      // Initialize your LocalStorage class
      ls = new LocalStorage();
    });
  
    describe('saveAuthCredentials', () => {
        it('should save user data to localStorage without altering the token', () => {
          const userData = { username: 'test', token: '123' };
          ls.saveAuthCredentials(userData);
          // Expect the saved userData to match the original, including the token
          expect(localStorage.getItem('aeprUser')).toBe(JSON.stringify(userData));
        });
    });
  
    describe('getAuthData', () => {
      it('should return the user data from localStorage', () => {
        const userData = { username: 'test', token: null };
        localStorage.setItem('aeprUser', JSON.stringify(userData));
        expect(ls.getAuthData()).toEqual(userData);
      });
    });
  
    describe('saveIsMobile', () => {
      it('should save mobile state to localStorage', () => {
        ls.saveIsMobile(true);
        expect(localStorage.getItem('aeprMobile')).toBe(JSON.stringify({ isMobile: true }));
      });
    });
  
    describe('getIsMobile', () => {
        it('should return the mobile state as true when set', () => {
          ls.saveIsMobile(true);
          expect(ls.getIsMobile()).toBe(true);
        });
      
        it('should return false if isMobile is not set in localStorage', () => {
          // Ensure localStorage does not have the key set
          localStorage.removeItem('aeprMobile');
          expect(ls.getIsMobile()).toBe(false);
        });
      });
  
    describe('mergeObjs', () => {
      it('should correctly merge two objects', () => {
        const objA = { a: 1 };
        const objB = { b: 2 };
        expect(ls.mergeObjs(objA, objB)).toEqual({ a: 1, b: 2 });
      });
    });
  });