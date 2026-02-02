import { motion } from 'framer-motion';
import { Check, ChefHat, Clock, Package, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import type { OrderStatus as OrderStatusType } from '@/types';

const statusSteps: {
  status: OrderStatusType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}[] = [
  { status: 'RECEIVED', icon: Clock, label: 'Order Received' },
  { status: 'PREPARING', icon: ChefHat, label: 'Preparing' },
  { status: 'OUT_FOR_DELIVERY', icon: Truck, label: 'Out for Delivery' },
  { status: 'DELIVERED', icon: Package, label: 'Delivered' },
];

const OrderStatusComponent = () => {
  const { currentOrder } = useCart();

  if (!currentOrder) return null;

  const currentIndex = statusSteps.findIndex(step => step.status === currentOrder.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl"
    >
      <Card className="shadow-elevated">
        <CardHeader className="text-center pb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary"
          >
            <Check className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <CardTitle className="font-heading text-2xl">Order Confirmed!</CardTitle>
          <Badge variant="outline" className="mx-auto mt-2">
            Order #{currentOrder.id}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Progress */}
          <div className="relative">
            <div className="absolute left-6 top-0 h-full w-0.5 bg-muted" />
            <div className="space-y-6">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.status}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-center gap-4"
                  >
                    <motion.div
                      animate={
                        isCurrent && currentOrder.status !== 'DELIVERED'
                          ? { scale: [1, 1.1, 1] }
                          : {}
                      }
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <p
                        className={`font-medium ${
                          isCompleted ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && currentOrder.status !== 'DELIVERED' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            In progress...
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Delivery Details */}
          <div className="rounded-xl bg-secondary/50 p-4">
            <h3 className="mb-3 font-heading font-semibold text-foreground">Delivery Details</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Name:</span> {currentOrder.name}
              </p>
              <p>
                <span className="font-medium text-foreground">Address:</span> {currentOrder.address}
              </p>
              <p>
                <span className="font-medium text-foreground">Phone:</span> {currentOrder.phone}
              </p>
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div>
            <h3 className="mb-3 font-heading font-semibold text-foreground">Order Summary</h3>
            <div className="space-y-2">
              {currentOrder.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between pt-2">
                <span className="font-semibold text-foreground">Total</span>
                <Badge className="font-heading text-lg font-bold">
                  ${currentOrder.total.toFixed(2)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderStatusComponent;
