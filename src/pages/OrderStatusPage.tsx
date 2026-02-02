import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import OrderStatus from '@/components/OrderStatus';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const OrderStatusPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { currentOrder, fetchOrderStatus, clearCurrentOrder } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId && (!currentOrder || currentOrder.id !== Number(orderId))) {
      fetchOrderStatus(Number(orderId));
    }
  }, [orderId, currentOrder, fetchOrderStatus]);

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-2xl font-bold">Order Not Found</h1>
            <p className="mb-6 text-muted-foreground">
              We couldn't find the order you're looking for.
            </p>
            <Button
              onClick={() => {
                // Clear order from localStorage first (synchronous)
                localStorage.removeItem('foodhub_current_order');
                // Clear state and stop polling
                clearCurrentOrder();
                // Navigate with state flag to prevent redirect loop
                navigate('/', { replace: true, state: { fromOrder: true } });
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => {
              // Clear order from localStorage first (synchronous)
              localStorage.removeItem('foodhub_current_order');
              // Clear state and stop polling
              clearCurrentOrder();
              // Navigate with state flag to prevent redirect loop
              navigate('/', { replace: true, state: { fromOrder: true } });
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Home
          </Button>
        </div>
        <OrderStatus />
      </main>
    </div>
  );
};

export default OrderStatusPage;
