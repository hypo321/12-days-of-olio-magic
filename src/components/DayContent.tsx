import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

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
    localVideo: '/content/rickroll.mp4',
  },
};

export const DayContent: React.FC<DayContentProps> = ({
  day,
  isVisible,
}) => {
  const content = CONTENT_DATA[day];
  const { day: activeDay } = useParams();
  const isActiveDay = activeDay === day.toString();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  if (!content) return null;

  // If it's day 12 and has a video, only show the video
  if (content.videoUrl || content.localVideo) {
    return (
      <motion.div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {content.localVideo ? (
          <video
            className="w-full h-full"
            autoPlay
            loop
            playsInline
            controls={false}
          >
            <source src={content.localVideo} type="video/mp4" />
          </video>
        ) : (
          <iframe
            className="w-full h-full"
            src={`${content.videoUrl?.replace(
              'watch?v=',
              'embed/'
            )}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&loop=1&playlist=${
              content.videoUrl?.split('v=')[1]
            }`}
            title="Video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </motion.div>
    );
  }

  // Calculate base font size based on container dimensions
  const baseFontSize = Math.min(
    containerSize.width / 25,
    containerSize.height / 35
  );

  // Adjust font sizes based on content amount
  const getFontSizes = () => {
    const contentLength = content.description?.length || 0;
    const hasStats = !!content.stats;
    const hasQuote = !!content.quote;

    let scale = 1;
    if (contentLength > 150) scale *= 0.9;
    if (contentLength > 200) scale *= 0.85;
    if (hasStats && hasQuote) scale *= 0.9;

    return {
      title: `${baseFontSize * scale * 1.5}px`,
      subtitle: `${baseFontSize * scale * 1.2}px`,
      description: `${baseFontSize * scale}px`,
      stats: {
        value: `${baseFontSize * scale * 1.2}px`,
        label: `${baseFontSize * scale * 0.8}px`,
      },
      quote: `${baseFontSize * scale * 0.9}px`,
      button: `${baseFontSize * scale * 0.9}px`,
    };
  };

  const fontSizes = getFontSizes();

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg bg-black/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {content.videoUrl ? (
        <div className="absolute inset-0">
          <iframe
            className="w-full h-full"
            src={content.videoUrl.replace('watch?v=', 'embed/')}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center rounded-lg"
          style={{
            backgroundImage: `url("/content/day${day}.jpg")`,
            opacity: 0.7,
          }}
        />
      )}
      <div className="relative z-10 w-full h-full grid place-items-center p-4">
        <div className="w-full max-w-[90%] max-h-[90%] overflow-y-auto scrollbar-hide">
          <motion.div
            className="grid gap-3 text-white text-center"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.h1
              className="font-bold leading-tight"
              style={{ fontSize: fontSizes.title }}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              {content.title}
            </motion.h1>

            {content.subtitle && (
              <motion.h2
                className="text-green-300 leading-tight"
                style={{ fontSize: fontSizes.subtitle }}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
              >
                {content.subtitle}
              </motion.h2>
            )}

            <motion.p
              className="leading-relaxed mx-auto"
              style={{ fontSize: fontSizes.description }}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              {content.description}
            </motion.p>

            {content.stats && (
              <motion.div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${content.stats.length}, 1fr)`,
                }}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
              >
                {content.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center"
                  >
                    <span
                      className="font-bold text-green-300"
                      style={{ fontSize: fontSizes.stats.value }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-gray-300"
                      style={{ fontSize: fontSizes.stats.label }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {content.quote && (
              <motion.blockquote
                className="italic text-gray-300"
                style={{ fontSize: fontSizes.quote }}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
              >
                <p>"{content.quote.text}"</p>
                <footer className="mt-2">
                  <span className="font-semibold">
                    {content.quote.author}
                  </span>
                  {content.quote.location && (
                    <span className="block opacity-75">
                      {content.quote.location}
                    </span>
                  )}
                </footer>
              </motion.blockquote>
            )}

            {content.ctaLink && (
              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
              >
                <a
                  href={content.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full transition-colors"
                  style={{ fontSize: fontSizes.button }}
                >
                  {content.ctaText || 'Learn More'}
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
