import React from 'react';
import { motion } from 'framer-motion';

interface DayContentProps {
  day: number;
  isVisible: boolean;
}

interface Quote {
  text: string;
  author: string;
  location?: string;
}

interface ContentData {
  backgroundImage?: string;
  videoUrl?: string;
  localVideo?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  quote?: Quote;
  stats?: Array<{ value: string; label: string }>;
  ctaLink?: string;
  ctaText?: string;
}

const CONTENT_DATA: Record<number, ContentData> = {
  1: {
    backgroundImage: '/content/day1-full.jpg',
    title: 'Welcome to 12 Days of Olio Magic! ',
    subtitle: "Together, we're building a world without waste",
    description:
      "Every year, 1/3 of all food produced globally goes to waste. At Olio, we're changing that, one share at a time. Join our movement of millions making a difference!",
    stats: [
      { value: '8M+', label: 'Community Members' },
      { value: '100M+', label: 'Portions Shared' },
      { value: '200+', label: 'Countries' },
    ],
    ctaLink: 'https://Olioapp.com/en/',
    ctaText: 'Join Olio Today',
  },
  2: {
    backgroundImage: '/content/day2-full.jpg',
    title: 'Meet Our Founders ',
    subtitle: 'Tessa Clarke & Saasha Celestial-One',
    description:
      'From a simple idea of not wanting to throw away food when moving house, Tessa and Saasha built Olio into a global movement. Their vision? A world where nothing goes to waste and every single person has enough to eat.',
    quote: {
      text: "I thought to myself, 'This is crazy. Why isn't there an app for this?'",
      author: 'Tessa Clarke',
      location: 'Olio Co-founder',
    },
  },
  3: {
    backgroundImage: '/content/day3-full.jpg',
    title: 'Food Waste Heroes ',
    description:
      "Our incredible Food Waste Heroes save surplus food from local businesses and share it with their community. They're the heartbeat of Olio, turning potential waste into wonderful meals.",
    stats: [
      { value: '35K+', label: 'Food Waste Heroes' },
      { value: '5M+', label: 'Meals Saved Monthly' },
    ],
    ctaLink: 'https://Olioapp.com/en/get-involved/',
    ctaText: 'Become a Food Waste Hero',
  },
  4: {
    backgroundImage: '/content/day4-full.jpg',
    title: 'Community Impact ',
    description:
      'Every share on Olio creates a ripple effect of positive change. From reducing CO2 emissions to helping neighbors in need, our community is making the world better one item at a time.',
    quote: {
      text: 'Olio has changed how I think about food waste. Now I can help my neighbors and save perfectly good food from the bin!',
      author: 'Sarah',
      location: 'London, UK',
    },
  },
  5: {
    backgroundImage: '/content/day5-full.jpg',
    title: 'Environmental Impact ',
    subtitle: 'Every Share Counts',
    description:
      "When you share on Olio, you're not just helping your community - you're helping the planet. Each food share prevents methane emissions and saves precious water resources.",
    stats: [
      { value: '40M+', label: 'Meals Saved' },
      { value: '120M+', label: 'Car Miles Saved' },
      { value: '6B+', label: 'Liters of Water Saved' },
    ],
  },
  6: {
    backgroundImage: '/content/day6-full.jpg',
    title: 'Olio Made Matches ',
    description:
      "Beautiful friendships form every day through Olio. Our community doesn't just share food - they share stories, cultures, and create lasting connections.",
    quote: {
      text: "Through Olio, I've met the most amazing neighbors. What started with sharing leftovers has turned into weekly community dinners!",
      author: 'Maria',
      location: 'Barcelona, Spain',
    },
  },
  7: {
    backgroundImage: '/content/day7-full.jpg',
    title: 'Zero Waste Living ',
    subtitle: 'Beyond Food Sharing',
    description:
      "Olio isn't just about food - it's about living more sustainably. From clothes to furniture, our community shares all sorts of items, giving them a second life and keeping them out of landfills.",
    stats: [
      { value: '25M+', label: 'Non-Food Items Shared' },
      { value: '60M+', label: 'Money Saved' },
    ],
  },
  8: {
    backgroundImage: '/content/day8-full.jpg',
    title: 'Global Movement ',
    description:
      'From Singapore to Sweden, Olio is bringing communities together worldwide. Our app is available in 60+ languages, making sharing possible across cultures and borders.',
    quote: {
      text: "Olio showed me that the spirit of sharing is truly universal. It's amazing to be part of this global community!",
      author: 'Miguel',
      location: 'Mexico City',
    },
  },
  9: {
    backgroundImage: '/content/day9-full.jpg',
    title: 'Business Impact ',
    subtitle: 'Partnering for Change',
    description:
      "Our partnerships with businesses help rescue tons of surplus food daily. From cafes to supermarkets, we're helping businesses reduce waste while supporting local communities.",
    stats: [
      { value: '5,000+', label: 'Business Partners' },
      { value: '30K+', label: 'Daily Collections' },
    ],
  },
  10: {
    backgroundImage: '/content/day10-full.jpg',
    title: 'Community Heroes ',
    description:
      'Our community is full of everyday heroes who go above and beyond. From organizing local sharing hubs to teaching others about food waste, these champions make Olio special.',
    quote: {
      text: "Being an Olio volunteer has given me purpose. It's amazing to see how many people we help every single day.",
      author: 'James',
      location: 'Sydney, Australia',
    },
  },
  11: {
    backgroundImage: '/content/day11-full.jpg',
    title: 'Future Vision ',
    subtitle: 'A World Without Waste',
    description:
      "We envision a future where sharing is the new shopping, where communities thrive through connection, and where nothing goes to waste. Together, we're making this vision a reality.",
    stats: [
      { value: '2030', label: 'Zero Waste Goal' },
      { value: '1B+', label: 'Target Users' },
    ],
  },
  12: {
    videoUrl: 'https://www.youtube.com/watch?v=ckhjdrOxBhU',
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const DayContent: React.FC<DayContentProps> = ({
  day,
  isVisible,
}) => {
  const content = CONTENT_DATA[day];

  // If it's a video day, render the video player
  if (content.videoUrl) {
    const videoId = content.videoUrl.split('v=')[1];
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-black aspect-video">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0 bg-cover bg-center rounded-lg"
        style={{
          backgroundImage: `url(/content/day${day}.jpg)`,
          //filter: 'brightness(0.5)',
          opacity: 0.5,
        }}
      />

      <div className="relative z-10 w-full h-full grid place-items-center p-8">
        <div className="w-full max-w-4xl max-h-full overflow-y-auto scrollbar-hide">
          <motion.div
            className="grid gap-6 text-white text-center"
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            variants={contentVariants}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold drop-shadow-lg"
              variants={itemVariants}
            >
              {content.title}
            </motion.h2>

            <motion.div
              className="text-lg md:text-xl space-y-4 drop-shadow-md"
              variants={itemVariants}
            >
              {content.description}
            </motion.div>

            {content.ctaLink && (
              <motion.div
                className="flex justify-center mt-4"
                variants={itemVariants}
              >
                <a
                  href={content.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 text-lg font-semibold text-black bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  {content.ctaText || 'Learn More'}
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
