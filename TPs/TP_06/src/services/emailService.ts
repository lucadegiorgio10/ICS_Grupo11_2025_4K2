import emailjs from '@emailjs/browser';
import { createDateFromStr } from '../utils/dateUtils';
import QRCode from 'qrcode';

const ENV = import.meta.env

interface EmailData {
    email: string;
    transactionId: string;
    visitDate: string;
    ticketCount: number;
    ticketType: string;
    paymentMethod: string;
    totalAmount: number;
    reservationCode?: string;
}

// Función para generar el código QR como Data URI
const generateQrCode = async (data: EmailData): Promise<string> => {
    try {
        // Crear objeto con la información relevante para el QR
        const qrData = {
            email: data.email,
            transactionId: data.transactionId,
            visitDate: data.visitDate,
            ticketCount: data.ticketCount,
            ticketType: data.ticketType,
            totalAmount: data.totalAmount,
            reservationCode: data.reservationCode || '',
            paymentMethod: data.paymentMethod
        };

        // Generar y retornar el QR como data URI
        return await QRCode.toDataURL(JSON.stringify(qrData));
    } catch (error) {
        console.error('Error generando código QR:', error);
        return '';
    }
};

export const emailService = {
    sendPurchaseConfirmation: async (data: EmailData) => {
        try {
            // Validación de variables de entorno
            if (
                !ENV.VITE_EMAILJS_SERVICE_ID ||
                !ENV.VITE_EMAILJS_TEMPLATE_ID_BOLETERIA ||
                !ENV.VITE_EMAILJS_TEMPLATE_ID_MERCADOPAGO ||
                !ENV.VITE_EMAILJS_PUBLIC_KEY
            ) {
                console.error('Faltan variables de entorno para EmailJS');
            }

            // Generar código QR
            const qrCodeDataUri = await generateQrCode(data);

            // Parámetros base comunes
            const baseParams = {
                email: data.email,
                visitDate: (() => {
                    const date = createDateFromStr(data.visitDate);
                    return date ? date.toLocaleDateString() : '';
                })(),
                ticketCount: data.ticketCount,
                ticketType: data.ticketType.toUpperCase(),
                totalAmount: data.totalAmount.toLocaleString('es-AR'),
                reservationCode: data.reservationCode,
                qrCodeImage: qrCodeDataUri, // Incluir la imagen QR
            };

            // Selección del template y parámetros específicos
            let templateParams;
            let selectedTemplate;
            if (data.paymentMethod === 'cash') {
                templateParams = {
                    ...baseParams,
                };
                selectedTemplate = ENV.VITE_EMAILJS_TEMPLATE_ID_BOLETERIA;
            } else {
                templateParams = {
                    ...baseParams,
                    paymentMethod: 'Tarjeta de crédito',
                };
                selectedTemplate = ENV.VITE_EMAILJS_TEMPLATE_ID_MERCADOPAGO;
            }

            console.log(qrCodeDataUri)

            console.log(ENV.VITE_ENVIO_MAIL)

            if (ENV.VITE_ENVIO_MAIL) {
                await emailjs.send(
                    ENV.VITE_EMAILJS_SERVICE_ID,
                    selectedTemplate,
                    templateParams,
                    ENV.VITE_EMAILJS_PUBLIC_KEY
                );
            }

            return { success: true };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }
    }
};
