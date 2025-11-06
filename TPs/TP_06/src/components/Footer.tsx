import { Container, Text, Group, ActionIcon, Stack, Divider, Anchor, Box, Grid } from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandTiktok,
  IconMail,
  IconPhone,
  IconMapPin
} from '@tabler/icons-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" bg="gray.8" c="white" py="xl" mt={40} bottom={0}>
      <Container size="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Text fw={700} size="lg">EcoHarmony Park</Text>
              <Text size="sm">El mejor lugar para vivir experiencias inolvidables con toda la familia.</Text>

              <Group gap="xs" mt="md">
                <ActionIcon variant="subtle" c="white" size="lg">
                  <IconBrandFacebook size={24} />
                </ActionIcon>
                <ActionIcon variant="subtle" c="white" size="lg">
                  <IconBrandTwitter size={24} />
                </ActionIcon>
                <ActionIcon variant="subtle" c="white" size="lg">
                  <IconBrandInstagram size={24} />
                </ActionIcon>
                <ActionIcon variant="subtle" c="white" size="lg">
                  <IconBrandYoutube size={24} />
                </ActionIcon>
                <ActionIcon variant="subtle" c="white" size="lg">
                  <IconBrandTiktok size={24} />
                </ActionIcon>
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Text fw={700} mb="xs">Enlaces útiles</Text>
              <Anchor c="white" component="a" href="/" underline="hover">Inicio</Anchor>
              <Anchor c="white" component="a" href="/" underline="hover">Atracciones</Anchor>
              <Anchor c="white" component="a" href="/" underline="hover">Horarios</Anchor>
              <Anchor c="white" component="a" href="/" underline="hover">Comprar Entradas</Anchor>
              <Anchor c="white" component="a" href="/" underline="hover">Contacto</Anchor>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Text fw={700} mb="xs">Contáctanos</Text>
              <Group gap="xs">
                <IconMapPin size={18} />
                <Text size="sm">Av. Siempre Viva 742, Springfield</Text>
              </Group>
              <Group gap="xs">
                <IconPhone size={18} />
                <Text size="sm">(123) 456-7890</Text>
              </Group>
              <Group gap="xs">
                <IconMail size={18} />
                <Text size="sm">info@ecoharmonypark.com</Text>
              </Group>
              <Text size="sm" mt="md">Horarios: Martes a Domingo de 10:00 a 20:00</Text>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="lg" color="gray.7" />

        <Group justify="space-between" wrap="wrap">
          <Text size="xs">© {currentYear} EcoHarmony Park. Todos los derechos reservados.</Text>
          <Group gap="md" wrap="nowrap">
            <Anchor c="white" component="a" href="/terminos" size="xs" underline="hover">
              Términos y Condiciones
            </Anchor>
            <Anchor c="white" component="a" href="/privacidad" size="xs" underline="hover">
              Política de Privacidad
            </Anchor>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
