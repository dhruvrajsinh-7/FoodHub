import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';

interface CheckoutFormProps {
  onBack: () => void;
}

const CheckoutForm = ({ onBack }: CheckoutFormProps) => {
  const { placeOrder, total } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        await placeOrder(formData);
        // Navigation will be handled by the index page useEffect
      } catch (error) {
        // Error is already handled in CartContext
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-1 flex-col"
    >
      <div className="p-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-4">
        <div className="flex-1 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-foreground">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4" />
              Delivery Address
            </Label>
            <Input
              id="address"
              placeholder="123 Main St, City, ZIP"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className={errors.address ? 'border-destructive' : ''}
            />
            {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="(555) 123-4567"
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="pb-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-medium text-foreground">Total</span>
            <Badge className="font-heading text-xl font-bold px-4 py-1">${total.toFixed(2)}</Badge>
          </div>
          <Button type="submit" className="w-full" size="lg">
            Place Order
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CheckoutForm;
