import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BrandingMode from './components/BrandingMode';
import ProductMode from './components/ProductMode';
import ReverseMode from './components/ReverseMode';
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<BrandingMode />} />
            <Route path="/product" element={<ProductMode />} />
            <Route path="/reverse" element={<ReverseMode />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;