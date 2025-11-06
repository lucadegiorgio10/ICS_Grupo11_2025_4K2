export function toLocalISODate(date: Date): string {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function fromISODate(dateStr: string | null): Date | null {
  if (!dateStr) return null;

  const [year, month, day] = dateStr.split('-').map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDate(date: Date | null, options: Intl.DateTimeFormatOptions = {}): string {
  if (!date) return '';
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  });
}

export const createDateFromStr = (dateStr: string | null): Date | null => {
  if (!dateStr) return null;

  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  return new Date(year, month, day);
};

export function diasHastaMismoDiaDelProximoMes(fecha: Date = new Date()): number {
  const dia = fecha.getDate();
  const mesActual = fecha.getMonth();
  const anio = fecha.getFullYear();

  // Crear una fecha para el mismo día del mes siguiente
  const proximoMes = new Date(anio, mesActual + 1, dia);

  // Si el mes siguiente no tiene ese día (por ejemplo, 31/01 → 28/02),
  // JavaScript ajusta la fecha automáticamente al siguiente mes,
  // por lo que la corregimos para que sea el último día del mes.
  if (proximoMes.getMonth() !== (mesActual + 1) % 12) {
    // Último día del próximo mes
    const ultimoDiaProximoMes = new Date(anio, mesActual + 2, 0);
    proximoMes.setDate(ultimoDiaProximoMes.getDate());
  }

  // Calcular la diferencia en milisegundos
  const diferenciaMs = proximoMes.getTime() - fecha.getTime();

  // Convertir a días
  const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

  return dias;
}
