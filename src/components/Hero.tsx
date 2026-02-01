import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="mb-4 px-4 py-2 text-sm" variant="secondary">
              🍕 Fresh & Fast Delivery
            </Badge>
          </motion.div>
          <h1 className="mb-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
            Delicious Food, <span className="text-primary">Delivered</span> to Your Door
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Explore our curated menu of mouth-watering dishes prepared with the freshest
            ingredients. From pizzas to poke bowls, we've got your cravings covered.
          </p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <Button variant="ghost" asChild>
              <a href="#menu" className="gap-2">
                <span className="font-medium">Browse Menu</span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowDown className="h-5 w-5" />
                </motion.div>
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
    </section>
  );
};

export default Hero;
