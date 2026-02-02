import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MenuCard from '@/components/MenuCard';
import CartDrawer from '@/components/CartDrawer';
import { menuItems as fallbackMenuItems } from '@/data/menuItems.ts';
import { useCart } from '@/context/CartContext';
import { apiService } from '@/services/api';
import type { MenuItem } from '@/types';

const Index = () => {
  const { currentOrder } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(fallbackMenuItems);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to fetch menu items from API, fallback to local data
    const fetchMenuItems = async () => {
      try {
        const response = await apiService.getMenuItems();
        if (response && Array.isArray(response) && response.length > 0) {
          setMenuItems(response);
        }
      } catch (error) {
        console.warn('Failed to fetch menu items from API, using fallback data:', error);
        // Use fallback data - already set as default
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Navigate to order status page if order exists
  // Don't redirect if user explicitly navigated from order page (via location state)
  useEffect(() => {
    const fromOrder = location.state?.fromOrder === true;
    if (currentOrder && !fromOrder) {
      navigate(`/order/${currentOrder.id}`, { replace: true });
    }
  }, [currentOrder, navigate, location.state]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Loading menu...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <main id="menu" className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-2 font-heading text-3xl font-bold text-foreground">Our Menu</h2>
          <p className="text-muted-foreground">Choose from our selection of delicious dishes</p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, index) => (
            <MenuCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </main>
      <CartDrawer />
    </div>
  );
};

export default Index;
