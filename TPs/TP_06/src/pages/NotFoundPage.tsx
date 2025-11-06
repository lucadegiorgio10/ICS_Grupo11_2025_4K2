import { Container, Title, Text, Button, Group, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container size="md" py={80}>
      <Stack align="center" gap="xl">

        <Title order={2} ta="center">¡Ups! Página no encontrada</Title>

        <Text ta="center" size="lg" maw={500}>
          Parece que te has perdido en el parque. La página que estás buscando no existe o ha sido movida.
        </Text>

        <Group mt="lg">
          <Button onClick={() => navigate('/')} size="md" color="brand">
            Volver al inicio
          </Button>
          <Button onClick={() => navigate(-1)} size="md" variant="outline" color="brand">
            Volver atrás
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
