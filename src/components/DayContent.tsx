import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

interface DayContentProps {
  day: number;
  isVisible: boolean;
}

interface Quote {
  text: string;
  author: string;
  location: string;
}

interface ContentData {
  backgroundImage: string;
  title: string;
  subtitle?: string;
  description: string;
  quote?: Quote;
  stats?: {
    value: string;
    label: string;
  }[];
  ctaLink?: string;
  ctaText?: string;
}

const CONTENT_DATA: Record<number, ContentData> = {
  1: {
    backgroundImage: "/content/day1-full.jpg",
    title: "Welcome to 12 Days of Olio Magic! ",
    subtitle: "Together, we're building a world without waste",
    description: "Every year, 1/3 of all food produced globally goes to waste. At OLIO, we're changing that, one share at a time. Join our movement of millions making a difference!",
    stats: [
      { value: "8M+", label: "Community Members" },
      { value: "100M+", label: "Portions Shared" },
      { value: "200+", label: "Countries" }
    ],
    ctaLink: "https://olioapp.com/en/",
    ctaText: "Join OLIO Today"
  },
  2: {
    backgroundImage: "/content/day2-full.jpg",
    title: "Meet Our Founders ",
    subtitle: "Tessa Clarke & Saasha Celestial-One",
    description: "From a simple idea of not wanting to throw away food when moving house, Tessa and Saasha built OLIO into a global movement. Their vision? A world where nothing goes to waste and every single person has enough to eat.",
    quote: {
      text: "I thought to myself, 'This is crazy. Why isn't there an app for this?'",
      author: "Tessa Clarke",
      location: "OLIO Co-founder"
    }
  },
  3: {
    backgroundImage: "/content/day3-full.jpg",
    title: "Food Waste Heroes ",
    description: "Our incredible Food Waste Heroes save surplus food from local businesses and share it with their community. They're the heartbeat of OLIO, turning potential waste into wonderful meals.",
    stats: [
      { value: "35K+", label: "Food Waste Heroes" },
      { value: "5M+", label: "Meals Saved Monthly" }
    ],
    ctaLink: "https://olioapp.com/en/get-involved/",
    ctaText: "Become a Food Waste Hero"
  },
  4: {
    backgroundImage: "/content/day4-full.jpg",
    title: "Community Impact ",
    description: "Every share on OLIO creates a ripple effect of positive change. From reducing CO2 emissions to helping neighbors in need, our community is making the world better one item at a time.",
    quote: {
      text: "OLIO has changed how I think about food waste. Now I can help my neighbors and save perfectly good food from the bin!",
      author: "Sarah",
      location: "London, UK"
    }
  },
  5: {
    backgroundImage: "/content/day5-full.jpg",
    title: "Environmental Impact ",
    subtitle: "Every Share Counts",
    description: "When you share on OLIO, you're not just helping your community - you're helping the planet. Each food share prevents methane emissions and saves precious water resources.",
    stats: [
      { value: "40M+", label: "Meals Saved" },
      { value: "120M+", label: "Car Miles Saved" },
      { value: "6B+", label: "Liters of Water Saved" }
    ]
  },
  6: {
    backgroundImage: "/content/day6-full.jpg",
    title: "OLIO Made Matches ",
    description: "Beautiful friendships form every day through OLIO. Our community doesn't just share food - they share stories, cultures, and create lasting connections.",
    quote: {
      text: "Through OLIO, I've met the most amazing neighbors. What started with sharing leftovers has turned into weekly community dinners!",
      author: "Maria",
      location: "Barcelona, Spain"
    }
  },
  7: {
    backgroundImage: "/content/day7-full.jpg",
    title: "Zero Waste Living ",
    subtitle: "Beyond Food Sharing",
    description: "OLIO isn't just about food - it's about living more sustainably. From clothes to furniture, our community shares all sorts of items, giving them a second life and keeping them out of landfills.",
    stats: [
      { value: "25M+", label: "Non-Food Items Shared" },
      { value: "60M+", label: "Money Saved" }
    ]
  },
  8: {
    backgroundImage: "/content/day8-full.jpg",
    title: "Global Movement ",
    description: "From Singapore to Sweden, OLIO is bringing communities together worldwide. Our app is available in 60+ languages, making sharing possible across cultures and borders.",
    quote: {
      text: "OLIO showed me that the spirit of sharing is truly universal. It's amazing to be part of this global community!",
      author: "Miguel",
      location: "Mexico City"
    }
  },
  9: {
    backgroundImage: "/content/day9-full.jpg",
    title: "Business Impact ",
    subtitle: "Partnering for Change",
    description: "Our partnerships with businesses help rescue tons of surplus food daily. From cafes to supermarkets, we're helping businesses reduce waste while supporting local communities.",
    stats: [
      { value: "5,000+", label: "Business Partners" },
      { value: "30K+", label: "Daily Collections" }
    ]
  },
  10: {
    backgroundImage: "/content/day10-full.jpg",
    title: "Community Heroes ",
    description: "Our community is full of everyday heroes who go above and beyond. From organizing local sharing hubs to teaching others about food waste, these champions make OLIO special.",
    quote: {
      text: "Being an OLIO volunteer has given me purpose. It's amazing to see how many people we help every single day.",
      author: "James",
      location: "Sydney, Australia"
    }
  },
  11: {
    backgroundImage: "/content/day11-full.jpg",
    title: "Future Vision ",
    subtitle: "A World Without Waste",
    description: "We envision a future where sharing is the new shopping, where communities thrive through connection, and where nothing goes to waste. Together, we're making this vision a reality.",
    stats: [
      { value: "2030", label: "Zero Waste Goal" },
      { value: "1B+", label: "Target Users" }
    ]
  },
  12: {
    backgroundImage: "/content/day12-full.jpg",
    title: "Join the Movement ",
    subtitle: "Be Part of the Solution",
    description: "Whether you're sharing food, saving surplus, or spreading the word, there's a place for you in the OLIO community. Together, we can build a more sustainable future.",
    ctaLink: "https://olioapp.com/en/get-involved/",
    ctaText: "Get Involved Today"
  }
};

export const DayContent: React.FC<DayContentProps> = ({ day, isVisible }) => {
  const content = CONTENT_DATA[day];
  const { day: activeDay } = useParams();
  const isActiveDay = activeDay === day.toString();
  
  if (!content) return null;

  // Calculate text scale factor based on content length
  const descriptionLength = content.description.length;
  const hasStats = !!content.stats;
  const hasQuote = !!content.quote;
  
  // Adjust base font sizes based on content amount
  const getTextScale = () => {
    let scale = 1;
    if (descriptionLength > 150) scale *= 0.85;
    if (descriptionLength > 200) scale *= 0.85;
    if (hasStats && hasQuote) scale *= 0.8;
    if (content.subtitle) scale *= 0.9;
    return scale;
  };

  const textScale = getTextScale();

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg bg-black/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Image - only load high quality for active day */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: isActiveDay ? 
            `url("${content.backgroundImage}")` : 
            `url("/content/day${day}-thumb.jpg")`,
          opacity: 0.7
        }} 
      />

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-2 text-white text-center">
        <div className="w-full max-h-full overflow-y-auto scrollbar-hide py-1">
          <motion.h1 
            className={`text-[min(${2.2 * textScale}vw,1.2rem)] font-bold mb-1 leading-tight`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {content.title}
          </motion.h1>
          
          {content.subtitle && (
            <motion.h2 
              className={`text-[min(${1.8 * textScale}vw,1rem)] mb-1 text-green-300 leading-tight`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {content.subtitle}
            </motion.h2>
          )}

          <motion.p 
            className={`text-[min(${1.5 * textScale}vw,0.875rem)] mb-2 max-w-[98%] mx-auto leading-snug`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {content.description}
          </motion.p>

          {content.stats && (
            <motion.div 
              className="grid grid-cols-3 gap-1 w-full max-w-[98%] mx-auto mb-1.5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {content.stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className={`text-[min(${1.8 * textScale}vw,1rem)] font-bold text-green-300 leading-tight`}>
                    {stat.value}
                  </span>
                  <span className={`text-[min(${1.2 * textScale}vw,0.7rem)] text-gray-300 leading-tight`}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {content.quote && (
            <motion.blockquote 
              className={`italic text-[min(${1.3 * textScale}vw,0.8rem)] text-gray-300 max-w-[95%] mx-auto mb-1.5`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="mb-0.5">"{content.quote.text}"</p>
              <footer className={`text-[min(${1.2 * textScale}vw,0.7rem)]`}>
                <span className="font-semibold">{content.quote.author}</span>
                {content.quote.location && (
                  <span className={`block text-[min(${1.1 * textScale}vw,0.65rem)]`}>
                    {content.quote.location}
                  </span>
                )}
              </footer>
            </motion.blockquote>
          )}

          {content.ctaLink && (
            <motion.a
              href={content.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block bg-green-500 hover:bg-green-600 text-[min(${1.3 * textScale}vw,0.8rem)] px-2.5 py-1 rounded-full transition-colors mt-1`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {content.ctaText || 'Learn More'}
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
