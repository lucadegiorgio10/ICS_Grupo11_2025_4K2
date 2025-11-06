import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from '../services/userService';

describe('userService', () => {
  const mockStorage: { [key: string]: string } = {}

  beforeEach(() => {
    vi.resetModules()

    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn((key) => mockStorage[key] || null),
      setItem: vi.fn((key, value) => { mockStorage[key] = value }),
      clear: vi.fn(() => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]) })
    }
    vi.stubGlobal('localStorage', mockLocalStorage)
  })

  describe('registrar usuario', () => {
    it('debería no registrar un usuario ya registrado', async () => {
      await userService.registerUser('test@example.com', 'password123');

      const result = await userService.registerUser('test@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('El usuario ya existe');
    });
  });

  describe('iniciar sesión', () => {
    it('deberia registrar usuario e iniciar sesión correctamente con credenciales validas', async () => {
      await userService.registerUser('test@example.com', 'password123');

      const result = await userService.login('test@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(userService.getCurrentUser()).toMatchObject({ "email": "test@example.com" })
    });
  });
});
