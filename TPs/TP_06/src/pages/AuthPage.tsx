import { useState } from 'react';
import { Container, Paper, TextInput, PasswordInput, Button, Title, Text, Anchor, Alert } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { notifications } from '@mantine/notifications';
import { IconInfoCircle } from '@tabler/icons-react';

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('El email es requerido');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Email inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string, isRegistering = false) => {
    if (!password) {
      setPasswordError('La contraseña es requerida');
      return false;
    }

    if (isRegistering) {
      if (password.length < 6) {
        setPasswordError('La contraseña debe tener al menos 6 caracteres');
        return false;
      }
      if (!/[A-Z]/.test(password)) {
        setPasswordError('La contraseña debe tener al menos una mayúscula');
        return false;
      }
      if (!/\d/.test(password)) {
        setPasswordError('La contraseña debe tener al menos un número');
        return false;
      }
    }

    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(''); // Limpiar error previo

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password, !isLogin);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        const result = await userService.login(email, password);
        if (result.success) {
          setEmail('');
          setPassword('');
          navigate('/');
        } else {
          setLoginError('Email o contraseña incorrectos');
        }
      } else {
        const result = await userService.registerUser(email, password);
        if (result.success) {
          setEmail('');
          setPassword('');
          notifications.show({
            title: 'Registro exitoso',
            message: 'Usuario registrado correctamente',
            color: 'brand',
            position: 'top-center'
          });
          navigate('/login');
        } else {
          notifications.show({
            title: 'Error',
            message: result.error || 'Error al registrar usuario',
            color: 'red',
            position: 'top-center'
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" c="brand.7">
        {isLogin ? 'Bienvenido de nuevo!' : 'Crear una cuenta'}
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {isLogin ? (
          <>
            ¿No tienes una cuenta?{' '}
            <Anchor size="sm" c="brand.7" onClick={() => navigate('/registro')}>
              Crear cuenta
            </Anchor>
          </>
        ) : (
          <>
            ¿Ya tienes una cuenta?{' '}
            <Anchor size="sm" c="brand.7" onClick={() => navigate('/login')}>
              Iniciar sesión
            </Anchor>
          </>
        )}
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" component="form" onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          placeholder="tu@email.com"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          error={emailError}
        />
        <PasswordInput
          label="Contraseña"
          placeholder="Tu contraseña"
          required
          mt="md"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value, !isLogin);
          }}
          error={passwordError}
        />
        {!isLogin && (
          <Text size="xs" c="dimmed" mt={4}>
            La contraseña debe contener:
            <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
              <li>Al menos 6 caracteres</li>
              <li>Al menos una letra mayúscula</li>
              <li>Al menos un número</li>
            </ul>
          </Text>
        )}
        {isLogin && loginError && (
          <Alert mt="xl" variant="light" color="red" title="Email o contraseña incorrectos" icon={<IconInfoCircle />} />
        )}
        <Button 
          fullWidth 
          mt="xl" 
          variant='gradient' 
          type="submit" 
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isLogin ? 'Iniciar sesión' : 'Registrarse'}
        </Button>
      </Paper>
    </Container>
  );
}

