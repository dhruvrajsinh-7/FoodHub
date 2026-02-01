import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import OrderStatus from '@/components/OrderStatus';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const OrderStatusPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { currentOrder, fetchOrderStatus } = useCart();

  useEffect(() => {
    if (orderId && (!currentOrder || currentOrder.id !== orderId)) {
      fetchOrderStatus(orderId);
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
            <Button asChild>
              <Link to="/">Return to Home</Link>
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
          <Button variant="ghost" asChild>
            <Link to="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Link>
          </Button>
        </div>
        <OrderStatus />
      </main>
    </div>
  );
};

export default OrderStatusPage;
