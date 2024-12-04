import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from '../utils/animations';

interface StatsGridProps {
  stats: Array<{ value: string; label: string }>;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => (
  <motion.div
    className={`grid gap-4 mt-6 ${
      stats.length === 1
        ? 'grid-cols-1'
        : stats.length === 2
        ? 'grid-cols-2'
        : stats.length === 4
        ? 'grid-cols-2 md:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
    }`}
    variants={itemVariants}
  >
    {stats.map((stat, index) => (
      <div key={index} className="text-center">
        <div className="text-3xl md:text-4xl font-bold">
          {stat.value}
        </div>
        <div className="text-sm md:text-base opacity-90">
          {stat.label}
        </div>
      </div>
    ))}
  </motion.div>
);
