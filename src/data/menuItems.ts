import type { MenuItem } from '@/types';
import pizzaImg from '@/assets/pizza.png';
import burgerImg from '@/assets/burger.png';
import tacosImg from '@/assets/tacos.png';
import pokeBowlImg from '@/assets/poke-bowl.png';
import pastaImg from '@/assets/pasta.png';
import saladImg from '@/assets/salad.png';

//TODO : move to a database
export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Pepperoni Pizza',
    description:
      'Classic pepperoni with melted mozzarella, fresh basil, and our signature tomato sauce on hand-tossed dough.',
    price: 16.99,
    imageUrl: pizzaImg,
    category: 'Pizza',
  },
  {
    id: 2,
    name: 'Double Smash Burger',
    description:
      'Two juicy beef patties with American cheese, crisp lettuce, tomato, pickles, and special sauce.',
    price: 14.99,
    imageUrl: burgerImg,
    category: 'Burgers',
  },
  {
    id: 3,
    name: 'Street Tacos',
    description:
      'Three authentic tacos with seasoned beef, fresh cilantro, onions, salsa verde, and lime wedges.',
    price: 12.99,
    imageUrl: tacosImg,
    category: 'Mexican',
  },
  {
    id: 4,
    name: 'Salmon Poke Bowl',
    description:
      'Fresh salmon sashimi over sushi rice with avocado, edamame, seaweed salad, and sesame dressing.',
    price: 18.99,
    imageUrl: pokeBowlImg,
    category: 'Healthy',
  },
  {
    id: 5,
    name: 'Pasta Carbonara',
    description:
      'Creamy Italian classic with pancetta, parmesan, egg yolk, and freshly cracked black pepper.',
    price: 15.99,
    imageUrl: pastaImg,
    category: 'Italian',
  },
  {
    id: 6,
    name: 'Caesar Salad',
    description:
      'Crisp romaine lettuce, homemade croutons, shaved parmesan, and creamy Caesar dressing.',
    price: 11.99,
    imageUrl: saladImg,
    category: 'Healthy',
  },
];
