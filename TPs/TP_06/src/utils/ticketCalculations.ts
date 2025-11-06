export const calcularPrecioPorTicket = (type: 'vip' | 'regular', edad: number): number => {
    // Validar la edad primero
    if (edad < 0 || edad > 110) {
        return 0;
    }

    const precioBase = type === 'vip' ? 10000 : 5000;

    if (edad <= 3) return 0;
    if (edad <= 15 || edad >= 60) return precioBase / 2;

    // El resto paga precio completo
    return precioBase;
};

export const calcularTotal = (ticketCount: number, ticketType: 'vip' | 'regular', visitorAges: number[]): number => {
    if (ticketCount <= 0 || ticketCount > 10) return 0;

    // Calcular suma de precios individuales según edad
    let total = 0;
    for (let i = 0; i < Math.min(ticketCount, visitorAges.length); i++) {
        const precio = calcularPrecioPorTicket(ticketType, visitorAges[i]);
        if (precio === -1) continue
        total += precio;
    }
    return total;
};
