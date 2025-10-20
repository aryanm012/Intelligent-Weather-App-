import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from 'react-router-dom';
import WeatherDetail from './pages/WeatherDetail.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path= "/" element = {<App />} />
        <Route path= "/weather/:city" element = {<WeatherDetail/>} />
      </Routes>
    </BrowserRouter>
    
  </StrictMode>,
)
