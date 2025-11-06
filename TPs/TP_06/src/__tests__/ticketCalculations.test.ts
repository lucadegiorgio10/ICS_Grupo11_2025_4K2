import { describe, it, expect } from 'vitest'
import { calcularPrecioPorTicket, calcularTotal } from '../utils/ticketCalculations'

describe('calculo de tickets', () => {
    describe('calcular precio por ticket', () => {
        // Casos limite
        it('debería manejar valores límite correctamente', () => {
            // Edad negativa (error)
            expect(calcularPrecioPorTicket('regular', -1)).toBe(0)

            // 0 años (gratis)
            expect(calcularPrecioPorTicket('regular', 0)).toBe(0)

            // 3 años (gratis)
            expect(calcularPrecioPorTicket('vip', 3)).toBe(0)

            // 4 años (descuento)
            expect(calcularPrecioPorTicket('regular', 4)).toBe(2500)

            // 15 años (descuento)
            expect(calcularPrecioPorTicket('vip', 15)).toBe(5000)

            // 16 años (precio completo)
            expect(calcularPrecioPorTicket('regular', 16)).toBe(5000)

            // 59 años (precio completo)
            expect(calcularPrecioPorTicket('vip', 59)).toBe(10000)

            // 60 años (descuento)
            expect(calcularPrecioPorTicket('regular', 60)).toBe(2500)

            // 110 años (descuento)
            expect(calcularPrecioPorTicket('vip', 110)).toBe(5000)

            // 111 años (error)
            expect(calcularPrecioPorTicket('regular', 111)).toBe(0)
        })
    })

    describe('calcular total', () => {
        it('debería calcular correctamente el total para 1 entrada regular adulto', () => {
            expect(calcularTotal(1, 'regular', [30])).toBe(5000)
        })

        it('debería calcular correctamente el total para entradas con diferentes edades', () => {
            expect(calcularTotal(3, 'vip', [2, 10, 35])).toBe(15000)
        })

        it('debería devolver 0 cuando no hay entradas', () => {
            expect(calcularTotal(0, 'regular', [])).toBe(0)
        })

        it('debería devolver 0 para cantidades negativas', () => {
            expect(calcularTotal(-1, 'vip', [])).toBe(0)
        })

        it('debería no considerar edades negativas', () => {
            expect(calcularTotal(2, 'vip', [-10, 20])).toBe(10000)
        })

        it('debería manejar el caso de más de 10 entradas', () => {
            expect(calcularTotal(11, 'regular', Array(11).fill(30))).toBe(0)
        })

        it('debería manejar el caso de arrays de edades vacíos o insuficientes', () => {
            expect(calcularTotal(2, 'regular', [40])).toBe(5000)
        })
    })
})
