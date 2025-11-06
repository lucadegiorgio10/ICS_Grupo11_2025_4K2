import { Container, Title, Text, Button, Stack, Grid, Card, Box, Image, useMantineTheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';

export function HomePage() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Box>
      <Image
        src="hero.png"
        width="100%"
        alt="Vista del EcoHarmony Park"
        style={{
          height: isMobile ? '50vh' : '75vh',
          objectFit: 'cover',
          objectPosition: 'top',
        }}
      />
      <Container size="lg">
        {/* Hero Section */}
        <Stack gap={isMobile ? 'md' : 'xl'} my={isMobile ? 'md' : 'xl'} align="center" >
          <Title c="brand.7">Bienvenidos a EcoHarmony Park</Title>
          <Text size="lg" c="brand.7">
            Descubre una experiencia única en nuestro bioparque donde la tecnología
            se une con la naturaleza.
          </Text>
          <Button
            size="lg"
            variant="filled"
            color="brand.7"
            fullWidth={isMobile}
            onClick={() => navigate('/registro')}
          >
            Registrate en nuestra app
          </Button>
        </Stack>

        {/* Features Section */}
        <Grid my={isMobile ? 'md' : 'xl'} gutter={isMobile ? 'sm' : 'md'}>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" bg="brand.4">
              <Title order={3} c="brand.7">Mapa Interactivo</Title>
              <Text c="brand.6">
                Explora el parque con nuestro mapa interactivo sectorizado por colores
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" bg="brand.4">
              <Title order={3} c="brand.7">Horarios de Alimentación</Title>
              <Text c="brand.6">
                Mantente informado sobre los horarios de alimentación de cada especie
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" bg="brand.4">
              <Title order={3} c="brand.7">Compra de Entradas</Title>
              <Text c="brand.6">
                Adquiere tus entradas fácilmente a través de nuestra aplicación
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Call to Action Section */}
        <Stack align="center" my={isMobile ? 'md' : 'xl'} gap={isMobile ? 'md' : 'xl'}>
          <Title order={2} style={{ textAlign: 'center' }} c="brand.7">Descarga Nuestra Aplicación</Title>
          <Text c="brand.7">
            Disponibles en App Store y Play Store.
          </Text>
          <Button
            size="lg"
            variant="outline"
            color="brand.7"
            fullWidth={isMobile}
          >
            Disponible en Play Store
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
