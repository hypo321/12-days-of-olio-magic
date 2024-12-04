import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from '../utils/animations';

interface QuoteBlockProps {
  text: string;
  author: string;
  location?: string;
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({
  text,
  author,
  location,
}) => (
  <motion.blockquote
    className="mt-6 space-y-2"
    variants={itemVariants}
  >
    <p className="text-xl md:text-2xl italic">"{text}"</p>
    <footer className="text-lg opacity-90">
      — {author}
      {location && <span className="opacity-75">, {location}</span>}
    </footer>
  </motion.blockquote>
);
