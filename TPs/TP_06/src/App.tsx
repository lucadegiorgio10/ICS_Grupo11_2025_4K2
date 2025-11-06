import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { TicketPurchasePage } from './pages/TicketPurchasePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useEffect } from 'react';
import { userService } from './services/userService';
import { ticketService } from './services/ticketService';
import '@mantine/dates/styles.css';
import { TransactionsPage } from './pages/TransactionsPage';
import { ProtectedRouteAdmin } from './components/ProtectedRouteAdmin';
import { Footer } from './components/Footer';
import { AppShell } from '@mantine/core';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  useEffect(() => {
    userService.initialize();
    ticketService.initializeAvailability();
  }, []);

  return (
    <Router>
      <TopBar />
      <AppShell
        footer={{ height: 'auto' }}
        styles={{
          root: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
          },
          main: {
            flex: '1 0 auto',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <div style={{ flex: '1 0 auto' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/registro" element={<AuthPage />} />
            <Route
              path="/tickets"
              element={
                <ProtectedRoute>
                  <TicketPurchasePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transacciones"
              element={
                <ProtectedRouteAdmin>
                  <TransactionsPage />
                </ProtectedRouteAdmin>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </AppShell>
    </Router>
  )
}

export default App
