import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Product, CartItem } from './types';
import { getProducts } from './services/storage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Services from './pages/Services';
import Admin from './pages/Admin';

const Layout: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();

  // Hide Navbar and Footer if current path starts with /admin
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Load products from storage
    setProducts(getProducts());

    // Load cart from session storage if exists
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const addToCart = (product: Product, selectedLiter?: string) => {
    // Default to first liter option if not specified
    const liter = selectedLiter || product.liters[0];
    const literIndex = product.liters.indexOf(liter);
    const price = product.price_uzs[literIndex];

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedLiter === liter);
      let newCart;
      if (existing) {
        newCart = prev.map(item =>
          (item.product.id === product.id && item.selectedLiter === liter)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prev, { product, selectedLiter: liter, selectedPrice: price, quantity: 1 }];
      }
      sessionStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateCartQuantity = (productId: string, liter: string, delta: number) => {
    setCart(prev => {
      const newCart = prev.map(item => {
        if (item.product.id === productId && item.selectedLiter === liter) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
      sessionStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    sessionStorage.removeItem('cart');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {!isAdmin && <Navbar cartCount={totalItems} />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
          <Route path="/products" element={<Products products={products} addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateCartQuantity} clearCart={clearCart} />} />
          <Route path="/services" element={<Services />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

import { LanguageProvider } from './contexts/LanguageContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <Layout />
      </Router>
    </LanguageProvider>
  );
};

export default App;