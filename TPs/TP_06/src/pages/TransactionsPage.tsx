import { useState, useEffect } from 'react';
import { Container, Title, Text, Tabs, Paper, Badge, Stack, Divider, Group, Card } from '@mantine/core';
import { transactionService, type Transaction } from '../services/transactionService';
import { IconCash, IconCreditCard, IconCalendar, IconTicket, IconReceipt, IconShoppingBag, IconMail } from '@tabler/icons-react';
import { createDateFromStr } from '../utils/dateUtils';

export function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>('all');

    useEffect(() => {
        const userTransactions = transactionService.getAllTransactions()
        setTransactions(userTransactions);
    }, []);

    const getFormattedDate = (dateStr: string) => {
        const date = createDateFromStr(dateStr);
        return date ? date.toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) : '';
    };

    const getFilteredTransactions = () => {
        if (activeTab === 'all') return transactions;
        if (activeTab === 'cash') return transactions.filter(t => t.paymentMethod === 'cash');
        if (activeTab === 'credit') return transactions.filter(t => t.paymentMethod === 'credit');
        return transactions;
    };

    const filteredTransactions = getFilteredTransactions();

    return (
        <Container size="xl" my={40}>
            <Stack gap="xl">
                <Title order={2} ta={{ base: 'center', sm: 'left' }} c="brand.7">
                    TRANSACCIONES
                </Title>

                <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List>
                        <Tabs.Tab value="all" leftSection={<IconShoppingBag size={16} />}>
                            Todas
                        </Tabs.Tab>
                        <Tabs.Tab value="cash" leftSection={<IconCash size={16} />}>
                            Reservas (Efectivo)
                        </Tabs.Tab>
                        <Tabs.Tab value="credit" leftSection={<IconCreditCard size={16} />}>
                            Compras (Tarjeta)
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>

                {filteredTransactions.length === 0 ? (
                    <Paper p="xl" withBorder radius="md" bg="brand.4" ta="center">
                        <Stack align="center" gap="md">
                            <IconReceipt size={48} color="#3E8914" />
                            <Title order={3} c="brand.7">No hay transacciones</Title>
                            <Text c="brand.6">No se encontraron transacciones en esta categoría.</Text>
                        </Stack>
                    </Paper>
                ) : (
                    <Stack gap="md">
                        {filteredTransactions.map((transaction) => (
                            <Card key={transaction.id} shadow="sm" radius="md" withBorder p="md">
                                <Card.Section bg={transaction.paymentMethod === 'cash' ? 'brand.4' : 'blue.0'} py="xs" px="md">
                                    <Group justify="space-between" wrap="nowrap">
                                        <Group gap="xs">
                                            {transaction.paymentMethod === 'cash' ? (
                                                <IconCash size={20} color="#3E8914" />
                                            ) : (
                                                <IconCreditCard size={20} color="#1C7ED6" />
                                            )}
                                            <Text fw={700} c={transaction.paymentMethod === 'cash' ? 'brand.7' : 'blue.7'}>
                                                {transaction.paymentMethod === 'cash' ? 'Reserva en efectivo' : 'Compra con tarjeta'}
                                            </Text>
                                        </Group>
                                        <Badge
                                            variant="filled"
                                            color={transaction.paymentMethod === 'cash' ? 'brand' : 'blue'}
                                        >
                                            {transaction.ticketType.toUpperCase()}
                                        </Badge>
                                    </Group>
                                </Card.Section>

                                <Stack gap="md" mt="md">
                                    <Group justify="space-between" wrap="nowrap">
                                        <Group gap="xs">
                                            <IconMail size={16} />
                                            <Text size="sm">Mail:</Text>
                                        </Group>
                                        <Text size="sm" fw={500}>{transaction.email}</Text>
                                    </Group>

                                    <Group justify="space-between" wrap="nowrap">
                                        <Group gap="xs">
                                            <IconCalendar size={16} />
                                            <Text size="sm">Fecha de visita:</Text>
                                        </Group>
                                        <Text size="sm" fw={500}>{getFormattedDate(transaction.visitDate)}</Text>
                                    </Group>

                                    <Group justify="space-between" wrap="nowrap">
                                        <Group gap="xs">
                                            <IconTicket size={16} />
                                            <Text size="sm">Cantidad:</Text>
                                        </Group>
                                        <Text size="sm" fw={500}>{transaction.ticketCount} entrada{transaction.ticketCount > 1 ? 's' : ''}</Text>
                                    </Group>

                                    <Group justify="space-between" wrap="nowrap">
                                        <Group gap="xs">
                                            <IconReceipt size={16} />
                                            <Text size="sm">Código:</Text>
                                        </Group>
                                        <Text size="sm" fw={500}>{transaction.reservationCode}</Text>
                                    </Group>
                                </Stack>

                                <Divider my="md" />

                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        {transaction.ts}
                                    </Text>
                                    <Text fw={700} size="lg">
                                        ${transaction.totalAmount.toLocaleString('es-AR')}
                                    </Text>
                                </Group>
                            </Card>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Container>
    );
}
