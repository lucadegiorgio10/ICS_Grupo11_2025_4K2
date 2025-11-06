import { toLocalISODate, addDays, diasHastaMismoDiaDelProximoMes } from '../utils/dateUtils';

interface TicketAvailability {
    [date: string]: boolean;
}

export const ticketService = {
    initializeAvailability: (baseDate?: Date) => {
        if (!localStorage.getItem('ticketAvailability')) {
            const availability: TicketAvailability = {};
            const today = baseDate || new Date();
            const diasCount = diasHastaMismoDiaDelProximoMes(today)

            // Generar fechas para el próximo mes
            for (let i = 0; i <= diasCount; i++) {
                const date = addDays(today, i);
                const day = date.getDay();
                const month = date.getMonth();
                const dayOfMonth = date.getDate();

                // Abierto de martes (2) a domingo (0), cerrado lunes (1)
                const isOpenDay = day !== 1;

                // Fechas especiales cerradas: Navidad y Año Nuevo
                const isChristmas = month === 11 && dayOfMonth === 25; // 25 de diciembre
                const isNewYear = month === 0 && dayOfMonth === 1;     // 1 de enero

                // El parque está abierto si es día de apertura y no es fecha especial cerrada
                const isOpen = isOpenDay && !isChristmas && !isNewYear;

                const dateStr = toLocalISODate(date); // Usar nuestra función personalizada
                availability[dateStr] = isOpen;
            }

            localStorage.setItem('ticketAvailability', JSON.stringify(availability));
            return availability;
        }
    },

    getAvailability: (date: string) => {
        const availability = JSON.parse(localStorage.getItem('ticketAvailability') || '{}');
        return availability[date] ? true : false;
    },

    getAvaibilityDays: () => {
        return localStorage.getItem('ticketAvailability');
    },
};
