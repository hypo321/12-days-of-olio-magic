import React from 'react';
import { motion } from 'framer-motion';
import { Emoji } from './Emoji';
import { itemVariants, contentVariants } from '../utils/animations';
import { ScreenEffect } from './ScreenEffect';

interface DayContentProps {
  day: number;
  isVisible: boolean;
}

/** Additional Components **/

// Reusable StatsGrid Component
const StatsGrid = ({
  stats,
}: {
  stats: Array<{ value: string; label: string }>;
}) => (
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

// Reusable QuoteBlock Component
const QuoteBlock = ({
  text,
  author,
  location,
}: {
  text: string;
  author: string;
  location?: string;
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

// LiteYouTubeEmbed Component
const LiteYouTubeEmbed = ({ videoId }: { videoId: string }) => (
  <div className="w-full h-full bg-black">
    <iframe
      className="w-full h-full"
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1&enablejsapi=0&playsinline=1&iv_load_policy=3`}
      title="YouTube video player"
      allow="autoplay"
      loading="lazy"
      sandbox="allow-scripts allow-presentation allow-same-origin"
      referrerPolicy="strict-origin"
      allowFullScreen
    />
  </div>
);

/** Content Components **/

const CONTENT_COMPONENTS: Record<number, () => React.ReactNode> = {
  1: () => (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black aspect-video">
      <LiteYouTubeEmbed videoId="PUdnFtSAg8c" />
    </div>
  ),

  2: () => (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        We rescued 30 million meals in 12 months
      </motion.h2>

      <Emoji name="party" />
    </>
  ),

  3: () => (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        Those meals fed xxx,xxx households
      </motion.h2>

      <motion.h3
        className="text-2xl md:text-3xl font-semibold drop-shadow-md"
        variants={itemVariants}
      >
        in UK and Irish communities
      </motion.h3>

      <Emoji name="🏡🥘" />
    </>
  ),

  4: () => (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        We saved x billion litres of water
      </motion.h2>

      <Emoji name="💧🏊‍♀️" />

      <motion.h3
        className="text-2xl md:text-3xl font-semibold drop-shadow-md"
        variants={itemVariants}
      >
        Which is enough to fill x Olympic swimming pools
      </motion.h3>
    </>
  ),

  5: () => (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        And amazingly - we've just hit
      </motion.h2>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        100 million meals rescued
      </motion.h2>
      <motion.h3
        className="text-2xl md:text-3xl font-semibold drop-shadow-md"
        variants={itemVariants}
      >
        since we were first founded in 2015
      </motion.h3>

      <Emoji name="🚀" />
    </>
  ),

  6: () => (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        But those numbers mean nothing...
      </motion.h2>
      <motion.h3
        className="text-2xl md:text-3xl font-semibold drop-shadow-md"
        variants={itemVariants}
      >
        without a snapshot of the human impact we're having
      </motion.h3>

      <Emoji name="🫶" />
    </>
  ),

  7: () => (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        Zero Waste Living
      </motion.h2>

      <motion.h3
        className="text-2xl md:text-3xl font-semibold drop-shadow-md"
        variants={itemVariants}
      >
        Beyond Food Sharing
      </motion.h3>

      <motion.p
        className="text-lg md:text-xl space-y-4 drop-shadow-md"
        variants={itemVariants}
      >
        Olio isn't just about food - it's about living more
        sustainably. From clothes to furniture, our community shares
        all sorts of items, giving them a second life and keeping them
        out of landfills.
      </motion.p>

      <StatsGrid
        stats={[
          { value: '25M+', label: 'Non-Food Items Shared' },
          { value: '60M+', label: 'Money Saved' },
        ]}
      />
    </>
  ),

  8: () => (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        Global Movement
      </motion.h2>

      <motion.p
        className="text-lg md:text-xl space-y-4 drop-shadow-md"
        variants={itemVariants}
      >
        From Singapore to Sweden, Olio is bringing communities
        together worldwide. Our app is available in 60+ languages,
        making sharing possible across cultures and borders.
      </motion.p>

      <QuoteBlock
        text="Olio showed me that the spirit of sharing is truly universal. It's amazing to be part of this global community!"
        author="Miguel"
        location="Mexico City"
      />
    </>
  ),

  9: () => (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        Business Impact
      </motion.h2>

      <motion.h3
        className="text-2xl md:text-3xl font-semibold drop-shadow-md"
        variants={itemVariants}
      >
        Partnering for Change
      </motion.h3>

      <motion.p
        className="text-lg md:text-xl space-y-4 drop-shadow-md"
        variants={itemVariants}
      >
        Our partnerships with businesses help rescue tons of surplus
        food daily. From cafes to supermarkets, we're helping
        businesses reduce waste while supporting local communities.
      </motion.p>

      <StatsGrid
        stats={[
          { value: '5,000+', label: 'Business Partners' },
          { value: '30K+', label: 'Daily Collections' },
        ]}
      />
    </>
  ),

  10: () => (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        Community Heroes
      </motion.h2>

      <motion.p
        className="text-lg md:text-xl space-y-4 drop-shadow-md"
        variants={itemVariants}
      >
        Our community is full of everyday heroes who go above and
        beyond. From organizing local sharing hubs to teaching others
        about food waste, these champions make Olio special.
      </motion.p>

      <QuoteBlock
        text="Being an Olio volunteer has given me purpose. It's amazing to see how many people we help every single day."
        author="James"
        location="Sydney, Australia"
      />
    </>
  ),

  11: () => (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        Future Vision
      </motion.h2>

      <motion.h3
        className="text-2xl md:text-3xl font-semibold drop-shadow-md"
        variants={itemVariants}
      >
        A World Without Waste
      </motion.h3>

      <motion.p
        className="text-lg md:text-xl space-y-4 drop-shadow-md"
        variants={itemVariants}
      >
        We envision a future where sharing is the new shopping, where
        communities thrive through connection, and where nothing goes
        to waste. Together, we're making this vision a reality.
      </motion.p>

      <StatsGrid
        stats={[
          { value: '2030', label: 'Zero Waste Goal' },
          { value: '1B+', label: 'Target Users' },
        ]}
      />
    </>
  ),

  12: () => (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black aspect-video">
      <LiteYouTubeEmbed videoId="ckhjdrOxBhU" />
    </div>
  ),
};

// Define which days have effects
const DAY_EFFECTS: Partial<
  Record<number, { effect: 'confetti' | 'hearts' }>
> = {
  2: { effect: 'confetti' },
  5: { effect: 'confetti' },
  6: { effect: 'hearts' },
};

/** DayContent Component **/
export const DayContent: React.FC<DayContentProps> = ({
  day,
  isVisible,
}) => {
  console.log(`DayContent ${day} visibility:`, isVisible);

  const ContentComponent = CONTENT_COMPONENTS[day];
  const dayEffect = DAY_EFFECTS[day];

  if (!ContentComponent) {
    return null;
  }

  const isVideoDay = [1, 12].includes(day); // Add any video days here

  if (isVideoDay) {
    // For video days, render the content directly
    return ContentComponent();
  }

  // Alternate between lilac and yellow backgrounds
  const bgColor = day % 2 === 0 ? 'bg-olio-lilac' : 'bg-olio-yellow';
  const textColor = 'text-gray-900'; // Dark text for both backgrounds since they're light

  // For other days, render with solid background and motion effects
  return (
    <div className="relative w-full h-full">
      <div
        className={`absolute inset-0 ${bgColor} rounded-lg opacity-95`}
      />
      <div className="relative z-10 w-full h-full grid place-items-center p-8">
        <div className="relative w-full max-w-4xl max-h-full overflow-y-auto scrollbar-hide">
          {isVisible && dayEffect && (
            <ScreenEffect
              effect={dayEffect.effect}
              className="absolute inset-0"
            />
          )}
          <motion.div
            className={`relative grid gap-6 ${textColor} text-center`}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            variants={contentVariants}
          >
            {ContentComponent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
