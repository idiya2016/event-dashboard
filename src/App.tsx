import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EventProvider, ToastProvider } from './context';
import { Navbar, ToastContainer } from './components';
import { Dashboard, EventForm, EventDetails, Analytics } from './pages';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <EventProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/events/new" element={<EventForm />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/events/:id/edit" element={<EventForm />} />
              </Routes>
            </main>
            <ToastContainer />
          </div>
        </Router>
      </EventProvider>
    </ToastProvider>
  );
};

export default App;
