import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

const MenuCard = ({ item, index }: MenuCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="group h-full overflow-hidden shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <Badge variant="secondary" className="absolute left-3 top-3">
            {item.category}
          </Badge>
        </div>
        <CardContent className="p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h3 className="font-heading text-lg font-semibold text-foreground">{item.name}</h3>
            <Badge
              variant="outline"
              className="font-heading text-lg font-bold text-primary border-primary"
            >
              ${item.price.toFixed(2)}
            </Badge>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {item.description}
          </p>
          <Button onClick={handleAddToCart} className="w-full gap-2" size="lg">
            <Plus className="h-4 w-4" />
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MenuCard;
