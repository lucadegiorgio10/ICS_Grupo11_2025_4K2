import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css';
import App from './App.tsx'
import { Notifications } from '@mantine/notifications'
import '@fontsource/montserrat'

const theme = createTheme({
  primaryColor: 'brand',
  colors: {
    brand: [
      '#134611',
      '#3E8914',
      '#3DA35D',
      '#96E072',
      '#E8FCCF',
      '#134611',
      '#3E8914',
      '#3DA35D',
      '#96E072',
      '#E8FCCF',
    ],
  },
  fontFamily: 'Montserrat, sans-serif',
  defaultGradient: {
    from: '#3E8914',
    to: '#3DA35D',
    deg: 45,
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <App />
    </MantineProvider>
  </StrictMode>,
)
