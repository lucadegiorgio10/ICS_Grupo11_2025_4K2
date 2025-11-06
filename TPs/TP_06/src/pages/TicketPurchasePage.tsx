import { Container, Title, NumberInput, Select, Button, Stack, Text, Accordion, Grid, Paper, Modal, Group, Loader, Divider } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useState, useEffect } from 'react';
import { ticketService } from '../services/ticketService';
import { transactionService } from '../services/transactionService';
import { emailService } from '../services/emailService';
import { useForm, Controller } from 'react-hook-form';
import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { calcularPrecioPorTicket, calcularTotal } from '../utils/ticketCalculations';
import { toLocalISODate, fromISODate, formatDate, addDays } from '../utils/dateUtils';

interface TicketFormData {
    visitDate: string | null;
    ticketCount: number;
    visitorAges: number[];
    ticketType: 'vip' | 'regular';
    paymentMethod: string;
}

export function TicketPurchasePage() {
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
    const navigate = useNavigate();

    // --- Form setup ---
    const getNextAvailableDate = () => {
        const today = new Date();
        const maxDays = 31;
        const availabilityData = JSON.parse(ticketService.getAvaibilityDays() || '{}');

        for (let i = 0; i < maxDays; i++) {
            const date = addDays(today, i);
            const dateStr = toLocalISODate(date);

            // Verificar si el parque está abierto
            if (availabilityData[dateStr]) {
                return dateStr;
            }
        }
        return null;
    };

    const [availability, setAvailability] = useState<boolean>(false);
    const [showSuccessCash, setShowSuccessCash] = useState(false);
    const [showSuccessCredit, setShowSuccessCredit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [reservationCode, setReservationCode] = useState<string>('');
    const [formKey, setFormKey] = useState(Date.now());

    const { control, handleSubmit, watch, formState: { errors, isValid }, setValue, reset } = useForm<TicketFormData>({
        defaultValues: {
            visitDate: getNextAvailableDate(),
            ticketCount: 1,
            visitorAges: Array(10).fill(null),
            ticketType: 'regular',
            paymentMethod: 'cash'
        },
        mode: 'onChange'
    });

    useEffect(() => {
        const defaultDate = getNextAvailableDate();

        if (defaultDate) setAvailability(ticketService.getAvailability(defaultDate));
    }, []);

    const ticketCount = watch('ticketCount');
    const ticketType = watch('ticketType');
    const paymentMethod = watch('paymentMethod');
    const visitorAges = watch('visitorAges');
    const validTicketCount = Math.min(Math.max(ticketCount, 1), 10);

    const handleCreditCardPayment = () => window.open('https://www.mercadopago.com.ar', '_blank');

    const onSubmit = async (data: TicketFormData) => {
        if (data.visitDate) {
            setIsLoading(true);
            try {
                const currentUserStr = localStorage.getItem('currentUser');
                const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

                // Generate unique code for both payment methods
                const purchaseCode = Math.random().toString(36).substring(7).toUpperCase();
                setReservationCode(purchaseCode);

                const transaction = transactionService.saveTransaction({
                    email: currentUser?.email || 'anonymous',
                    visitDate: data.visitDate,
                    ticketCount: data.ticketCount,
                    ticketType: data.ticketType,
                    paymentMethod: data.paymentMethod,
                    totalAmount: calcularTotal(ticketCount, ticketType, visitorAges.slice(0, validTicketCount)),
                    reservationCode: purchaseCode,
                    ts: new Date().toLocaleString()
                });

                // Enviar mail de confirmacion
                await emailService.sendPurchaseConfirmation({
                    email: currentUser?.email,
                    transactionId: transaction.id,
                    visitDate: data.visitDate,
                    ticketCount: data.ticketCount,
                    ticketType: data.ticketType,
                    paymentMethod: data.paymentMethod,
                    totalAmount: calcularTotal(ticketCount, ticketType, visitorAges.slice(0, validTicketCount)),
                    reservationCode: purchaseCode
                });

                if (data.paymentMethod === 'credit') {
                    setShowSuccessCredit(true);
                    setTimeout(() => {
                        handleCreditCardPayment();
                    }, 1000);
                } else {
                    setShowSuccessCash(true);
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBackToHome = () => {
        setShowSuccessCash(false);
        setShowSuccessCredit(false);
        navigate('/');
        reset({
            visitDate: getNextAvailableDate(),
            ticketCount: 1,
            visitorAges: Array(10).fill(null),
            ticketType: 'regular',
            paymentMethod: 'cash'
        });
        setFormKey(Date.now()); // Generar nueva clave para forzar re-renderización
    };

    const handleBuyMore = () => {
        setShowSuccessCash(false);
        setShowSuccessCredit(false);
        reset({
            visitDate: getNextAvailableDate(),
            ticketCount: 1,
            visitorAges: Array(10).fill(null),
            ticketType: 'regular',
            paymentMethod: 'cash'
        });
        setFormKey(Date.now()); // Generar nueva clave para forzar re-renderización
    }
    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(new Date().getDate() + 31);
        return maxDate;
    };

    const isDateDisabled = (date: string) => {
        const parsedDate = fromISODate(date);
        if (!parsedDate) return true;

        const day = parsedDate.getDay();
        const month = parsedDate.getMonth();
        const dayOfMonth = parsedDate.getDate();

        // Cerrado los lunes (1)
        if (day === 1) return true;

        // Cerrado en Navidad y Año Nuevo
        if ((month === 11 && dayOfMonth === 25) || (month === 0 && dayOfMonth === 1))
            return true;

        return false;
    };

    const handleDateChange = (date: string | null) => {
        setValue('visitDate', date);
        if (date) setAvailability(ticketService.getAvailability(date));
    };

    return (
        <Container size="xl" my="40px">
            <Title order={2} mb="xl" ta={{ base: 'center', sm: 'left' }}>
                Comprar Entradas
            </Title>

            <Stack gap="xl">
                <Grid gutter={{ base: 'md', sm: 'lg', md: 'xl' }}>
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <form key={formKey} id="ticketForm" onSubmit={handleSubmit(onSubmit)}>
                            <Stack
                                gap="md"
                                align="stretch"
                            >
                                <Controller
                                    name="visitDate"
                                    control={control}
                                    rules={{ required: 'Debes seleccionar una fecha' }}
                                    render={({ field }) => (
                                        <DatePickerInput
                                            {...field}
                                            label="Fecha de visita"
                                            placeholder="Selecciona una fecha"
                                            onChange={handleDateChange}
                                            excludeDate={isDateDisabled}
                                            minDate={new Date()}
                                            maxDate={getMaxDate()}
                                            valueFormat="DD/MM/YYYY"
                                            description="El parque abre de martes a domingo, excepto Navidad y Año Nuevo"
                                            error={errors.visitDate?.message}
                                            required
                                            getDayProps={(date) => ({
                                                style: {
                                                    color: 'inherit'
                                                }
                                            })}
                                        />
                                    )}
                                />

                                {!availability ?
                                    <Text c="red.5">El parque está cerrado en la fecha seleccionada.</Text>
                                    :
                                    <>
                                        <Controller
                                            name="ticketCount"
                                            control={control}
                                            rules={{
                                                required: 'Debes ingresar la cantidad de entradas',
                                                min: { value: 1, message: 'Debes comprar al menos 1 entrada' },
                                                max: { value: 10, message: 'Máximo 10 entradas por compra' }
                                            }}
                                            render={({ field }) => (
                                                <NumberInput
                                                    {...field}
                                                    label="Cantidad de entradas"
                                                    min={1}
                                                    max={10}
                                                    description="Máximo 10 entradas por compra"
                                                    error={errors.ticketCount?.message}
                                                    required
                                                    w={isMobile ? '100%' : 'auto'}
                                                    onKeyDown={(e) => {
                                                        if (
                                                            !/[0-9]/.test(e.key) &&
                                                            !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)
                                                        ) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                    onPaste={(e) => {
                                                        const pasted = e.clipboardData.getData('Text')
                                                        if (!/^\d+$/.test(pasted)) e.preventDefault()
                                                    }}
                                                />
                                            )}
                                        />

                                        {ticketCount > 0 && (
                                            <Accordion variant="contained" radius="sm">
                                                <Accordion.Item value="visitors">
                                                    <Accordion.Control>
                                                        <Text size="sm" fw={500}>Datos de los visitantes ({validTicketCount})</Text>
                                                    </Accordion.Control>
                                                    <Accordion.Panel>
                                                        <Stack gap="md">
                                                            {Array.from({ length: validTicketCount }).map((_, index) => (
                                                                <Controller
                                                                    key={`visitor-${index}-${formKey}`}
                                                                    name={`visitorAges.${index}`}
                                                                    control={control}
                                                                    rules={{
                                                                        required: 'Edad requerida',
                                                                        min: { value: 0, message: 'Edad mínima 0' },
                                                                        max: { value: 110, message: 'Edad máxima 110' }
                                                                    }}
                                                                    render={({ field }) => (
                                                                        <NumberInput
                                                                            {...field}
                                                                            label={`Visitante ${index + 1}`}
                                                                            placeholder="Edad"
                                                                            min={0}
                                                                            max={110}
                                                                            value={field.value ?? null}
                                                                            defaultValue={undefined}
                                                                            error={errors.visitorAges?.[index]?.message}
                                                                            required
                                                                            w={isMobile ? '100%' : 'auto'}
                                                                            onKeyDown={(e) => {
                                                                                if (
                                                                                    !/[0-9]/.test(e.key) &&
                                                                                    !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)
                                                                                ) {
                                                                                    e.preventDefault()
                                                                                }
                                                                            }}
                                                                            onPaste={(e) => {
                                                                                const pasted = e.clipboardData.getData('Text')
                                                                                if (!/^\d+$/.test(pasted)) e.preventDefault()
                                                                            }}
                                                                        />
                                                                    )}
                                                                />
                                                            ))}
                                                        </Stack>
                                                    </Accordion.Panel>
                                                </Accordion.Item>
                                            </Accordion>
                                        )}
                                    </>
                                }

                                <Controller
                                    name="ticketType"
                                    control={control}
                                    rules={{ required: 'Selecciona un tipo de entrada' }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Tipo de entrada"
                                            data={[
                                                { value: 'regular', label: 'Regular' },
                                                { value: 'vip', label: 'VIP' }
                                            ]}
                                            error={errors.ticketType?.message}
                                            required
                                            comboboxProps={{ position: 'bottom-start' }}

                                            w={isMobile ? '100%' : 'auto'}
                                        />
                                    )}
                                />

                                <Controller
                                    name="paymentMethod"
                                    control={control}
                                    rules={{ required: 'Selecciona un método de pago' }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Forma de pago"
                                            data={[
                                                { value: 'cash', label: 'Efectivo en boletería' },
                                                { value: 'credit', label: 'Tarjeta de crédito' }
                                            ]}
                                            description="El pago en efectivo se realiza al momento de ingresar al parque"
                                            error={errors.paymentMethod?.message}
                                            required
                                            comboboxProps={{ position: 'bottom-start' }}
                                            w={isMobile ? '100%' : 'auto'}
                                        />
                                    )}
                                />
                            </Stack>
                        </form>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        {ticketCount > 0 && ticketType && visitorAges.slice(0, validTicketCount).filter(age => age !== null).length > 0 && (
                            <Paper
                                withBorder
                                p="md"
                                radius="md"
                                style={{ position: isMobile ? 'static' : 'sticky', top: 20 }}
                            >
                                <Title order={3} mb="md" ta={{ base: 'center', md: 'left' }}>
                                    Resumen de compra
                                </Title>
                                <Stack
                                    gap="xs"
                                    align="stretch"
                                    justify="flex-start"
                                >
                                    <Text>
                                        {validTicketCount} entrada{ticketCount > 1 ? 's' : ''} {ticketType.toUpperCase()}
                                    </Text>

                                    {/* Desglose por categorías de edad */}
                                    {visitorAges.slice(0, validTicketCount).filter(age => age !== null && age <= 3).length > 0 && (
                                        <Group justify='space-between'>
                                            <Text size="sm">
                                                Menores de 3 años: gratis ({visitorAges.slice(0, validTicketCount).filter(age => age !== null && age <= 3).length})
                                            </Text>
                                            <Text size='lg'>
                                                ${calcularPrecioPorTicket(ticketType, visitorAges.slice(0, validTicketCount).filter(age => age !== null && age <= 3)[0]) * visitorAges.slice(0, validTicketCount).filter(age => age !== null && age <= 3).length}
                                            </Text>
                                        </Group>
                                    )}

                                    {visitorAges.slice(0, validTicketCount).filter(age => age !== null && ((age > 3 && age <= 15) || age >= 60)).length > 0 && (
                                        <Group justify='space-between' wrap='nowrap'>
                                            <Text size="sm">
                                                Menores de 15 y mayores de 60: ${calcularPrecioPorTicket(ticketType, visitorAges.slice(0, validTicketCount).filter(age => age !== null && ((age > 3 && age <= 15) || age >= 60))[0]).toLocaleString('es-AR')} ({visitorAges.slice(0, validTicketCount).filter(age => age !== null && ((age > 3 && age <= 15) || age >= 60)).length})
                                            </Text>
                                            <Text size='lg'>
                                                ${(calcularPrecioPorTicket(ticketType, visitorAges.slice(0, validTicketCount).filter(age => age !== null && ((age > 3 && age <= 15) || age >= 60))[0]) * visitorAges.slice(0, validTicketCount).filter(age => age !== null && ((age > 3 && age <= 15) || age >= 60)).length).toLocaleString('es-AR')}
                                            </Text>
                                        </Group>
                                    )}

                                    {visitorAges.slice(0, validTicketCount).filter(age => age !== null && age > 15 && age < 60).length > 0 && (
                                        <Group justify='space-between'>
                                            <Text size="sm">
                                                Adultos: ${calcularPrecioPorTicket(ticketType, visitorAges.slice(0, validTicketCount).filter(age => age !== null && age > 15 && age < 60)[0]).toLocaleString('es-AR')} ({visitorAges.slice(0, validTicketCount).filter(age => age !== null && age > 15 && age < 60).length})
                                            </Text>
                                            <Text size='lg'>
                                                ${(calcularPrecioPorTicket(ticketType, visitorAges.slice(0, validTicketCount).filter(age => age !== null && age > 15 && age < 60)[0]) * visitorAges.slice(0, validTicketCount).filter(age => age !== null && age > 15 && age < 60).length).toLocaleString('es-AR')}
                                            </Text>
                                        </Group>
                                    )}
                                    <Divider />
                                    <Group justify='space-between'>
                                        <Text fw={700} mt="lg">
                                            TOTAL:
                                        </Text>
                                        <Text fw={700} size='lg' mt="lg">
                                            ${calcularTotal(validTicketCount, ticketType, visitorAges.slice(0, validTicketCount)).toLocaleString('es-AR')}
                                        </Text>
                                    </Group>

                                </Stack>
                            </Paper>
                        )}
                    </Grid.Col>
                </Grid>

                <Button
                    type="submit"
                    form="ticketForm"
                    w={isMobile ? '100%' : '66%'}
                    disabled={!isValid || !availability}
                    color={paymentMethod === 'credit' ? 'blue' : 'brand'}
                >
                    {paymentMethod === 'credit'
                        ? `Pagar con Mercado Pago ($${calcularTotal(validTicketCount, ticketType, visitorAges.slice(0, validTicketCount)).toLocaleString('es-AR')})`
                        : `Reservar y pagar en boletería ($${calcularTotal(validTicketCount, ticketType, visitorAges.slice(0, validTicketCount)).toLocaleString('es-AR')})`
                    }
                </Button>
            </Stack>

            <Modal
                opened={isLoading}
                onClose={() => { }}
                size="sm"
                centered
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                <Stack align="center" gap="md" py="xl">
                    <Loader size="xl" color="brand" />
                    <Text size="lg" ta="center">Procesando tu compra...</Text>
                </Stack>
            </Modal>

            <Modal
                opened={showSuccessCash}
                onClose={() => setShowSuccessCash(false)}
                size="lg"
                centered
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                <Stack align="center" gap="xl" py="xl">
                    <Title order={2} c="brand.7" ta="center">
                        ¡Reserva exitosa!
                    </Title>
                    <Stack gap="md" align="center">
                        <Text size="lg" ta="center">Has reservado:</Text>
                        <Text fw={500}>{ticketCount} entrada{ticketCount > 1 ? 's' : ''} {ticketType.toUpperCase()}</Text>
                        <Text>Para el día {formatDate(fromISODate(watch('visitDate')))}</Text>
                        <Text size="sm" c="dimmed" ta='center' mt="md">
                            Te hemos enviado un correo electrónico con los detalles para realizar el pago en boletería.
                        </Text>
                    </Stack>
                    <Paper withBorder p="lg" radius="md" bg="brand.4">
                        <Stack align="center" gap="xs">
                            <Text size="sm">Tu código de reserva es:</Text>
                            <Title order={3}>{reservationCode}</Title>
                            <Text size="xs" c="dimmed">Presenta este código en boletería</Text>
                        </Stack>
                    </Paper>
                    <Group>
                        <Button color="brand" onClick={handleBackToHome}>
                            Volver al inicio
                        </Button>
                        <Button color="brand" variant='outline' onClick={handleBuyMore}>
                            Comprar mas entradas
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            <Modal
                opened={showSuccessCredit}
                onClose={() => setShowSuccessCredit(false)}
                size="lg"
                centered
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                <Stack align="center" gap="xl" py="xl">
                    <Title order={2} c="brand.7" ta="center">
                        ¡Compra iniciada!
                    </Title>
                    <Stack gap="md" align="center">
                        <Text size="lg" ta="center">Has seleccionado:</Text>
                        <Text fw={500}>{ticketCount} entrada{ticketCount > 1 ? 's' : ''} {ticketType.toUpperCase()}</Text>
                        <Text>Para el día {formatDate(fromISODate(watch('visitDate')))}</Text>
                        <Text fw={700}>Total: ${calcularTotal(validTicketCount, ticketType, visitorAges.slice(0, validTicketCount)).toLocaleString('es-AR')}</Text>
                        <Text size="sm" c="dimmed" ta='center' mt="md">
                            Te hemos redirigido a Mercado Pago para completar tu pago.
                            Una vez finalizado, recibirás un correo electrónico con tus entradas.
                        </Text>
                    </Stack>
                    <Paper withBorder p="lg" radius="md" bg="brand.4">
                        <Stack align="center" gap="xs">
                            <Text size="sm">Tu código de compra es:</Text>
                            <Title order={3}>{reservationCode}</Title>
                            <Text size="xs" c="dimmed">Este código también fue enviado a tu correo electrónico</Text>
                        </Stack>
                    </Paper>
                    <Group>
                        <Button color="brand" onClick={handleBackToHome}>
                            Volver al inicio
                        </Button>
                        <Button color="brand" variant='outline' onClick={handleBuyMore}>
                            Comprar mas entradas
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}
