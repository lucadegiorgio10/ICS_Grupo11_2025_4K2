import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ticketService } from '../services/ticketService'

describe('ticketService', () => {
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

  describe('inicializar disponibilidad', () => {
    it('debería inicializar correctamente la disponibilidad para el próximo mes', () => {
      // Crear una fecha fija para la prueba (12 de diciembre de 2025, viernes)
      const testDate = new Date(2025, 11, 12);

      // Ejecutar con la fecha fija
      const result = ticketService.initializeAvailability(testDate);

      // Verificar
      expect(result).toBeDefined();
      expect(Object.keys(result || {}).length).toBeGreaterThan(0);

      // Verificar fechas usando operaciones relativas a la fecha de prueba
      const sunday = new Date(testDate); // Domingo - abierto
      sunday.setDate(testDate.getDate() + 2);
      const sundayStr = sunday.toISOString().split('T')[0];
      expect(result?.[sundayStr]).toBe(true);

      const monday = new Date(testDate); // Lunes - cerrado
      monday.setDate(testDate.getDate() + 3);
      const mondayStr = monday.toISOString().split('T')[0];
      expect(result?.[mondayStr]).toBe(false);

      const tuesday = new Date(testDate); // Martes - abierto
      tuesday.setDate(testDate.getDate() + 4);
      const tuesdayStr = tuesday.toISOString().split('T')[0];
      expect(result?.[tuesdayStr]).toBe(true);

      // Verificar una fecha especial - Navidad
      const christmas = new Date(testDate.getFullYear(), 11, 25);
      const christmasStr = christmas.toISOString().split('T')[0];
      expect(result?.[christmasStr]).toBe(false);

      // Verificar una fecha especial - Año Nuevo
      const newYear = new Date(testDate.getFullYear() + 1, 0, 1);
      const newYearStr = newYear.toISOString().split('T')[0];
      expect(result?.[newYearStr]).toBe(false);
    });

    it('debería funcionar con la fecha actual del sistema', () => {
      // Esta prueba verifica que la función funcione sin parámetros
      const result = ticketService.initializeAvailability();
      expect(result).toBeDefined();
      expect(Object.keys(result || {}).length).toBeGreaterThan(0);
    });
  })

  describe('obtener disponibilidad', () => {
    it('debería devolver true para una fecha disponible', () => {
      const mockAvailability = { '2025-09-20': true }
      localStorage.setItem('ticketAvailability', JSON.stringify(mockAvailability))

      const result = ticketService.getAvailability('2025-09-20')

      expect(result).toBe(true)
    })

    it('debería devolver false para una fecha cerrada', () => {
      const mockAvailability = { '2025-09-20': false, '2025-09-21': true }
      localStorage.setItem('ticketAvailability', JSON.stringify(mockAvailability))

      const result = ticketService.getAvailability('2025-09-20')

      expect(result).toBe(false)
    })

    it('debería devolver false para una fecha no registrada', () => {
      const mockAvailability = { '2025-09-20': true }
      localStorage.setItem('ticketAvailability', JSON.stringify(mockAvailability))

      const result = ticketService.getAvailability('2025-01-01')

      expect(result).toBe(false)
    })
  })

  describe('obtener dias disponibles', () => {
    it('debería devolver la información de disponibilidad guardada', () => {
      const mockAvailability = { '2025-09-20': true, '2025-09-21': false }
      localStorage.setItem('ticketAvailability', JSON.stringify(mockAvailability))

      const result = ticketService.getAvaibilityDays()

      expect(result).toBe(JSON.stringify(mockAvailability))
    })
  })
})
