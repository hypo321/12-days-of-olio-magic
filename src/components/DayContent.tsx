import React from 'react';
import { motion } from 'framer-motion';

interface DayContentProps {
  day: number;
  isVisible: boolean;
}

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
  visible: { opacity: 1, y: 0 },
};

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

const CONTENT_COMPONENTS: Record<number, React.ReactNode> = {
  1: (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black aspect-video">
      <LiteYouTubeEmbed videoId="PUdnFtSAg8c" />
    </div>
  ),

  2: (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        We rescued 30 million meals in 12 months
      </motion.h2>

      <motion.img
        src="/content/party.png" // Replace with your actual image path
        alt="30 million meals rescued"
        className="mt-4 mx-auto rounded-lg max-w-full"
        variants={itemVariants}
      />
    </>
  ),

  3: (
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

      <motion.img
        src="/content/party.png" // Replace with your actual image path
        alt="30 million meals rescued"
        className="mt-4 mx-auto rounded-lg max-w-full"
        variants={itemVariants}
      />
    </>
  ),

  4: (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        We saved x billion litres of water
      </motion.h2>

      <motion.img
        src="/content/swimmer.png" // Replace with your actual image path
        alt="30 million meals rescued"
        className="mt-4 mx-auto rounded-lg max-w-full"
        variants={itemVariants}
      />

      <motion.h3
        className="text-2xl md:text-3xl font-semibold drop-shadow-md"
        variants={itemVariants}
      >
        Which is enough to fill x Olympic swimming pools
      </motion.h3>
    </>
  ),

  5: (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        We diverted x tonnes of Co2 from the atmosphere
      </motion.h2>

      <motion.img
        src="/content/sun-behind-cloud.png" // Replace with your actual image path
        alt="30 million meals rescued"
        className="mt-4 mx-auto rounded-lg max-w-full"
        variants={itemVariants}
      />

      <motion.h3
        className="text-2xl md:text-3xl font-semibold drop-shadow-md"
        variants={itemVariants}
      >
        Which is the same as cancelling out x flights from London to
        New York
      </motion.h3>
    </>
  ),

  6: (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        Olio Made Matches
      </motion.h2>

      <motion.p
        className="text-lg md:text-xl space-y-4 drop-shadow-md"
        variants={itemVariants}
      >
        Beautiful friendships form every day through Olio. Our
        community doesn't just share food - they share stories,
        cultures, and create lasting connections.
      </motion.p>

      <QuoteBlock
        text="Through Olio, I've met the most amazing neighbors. What started with sharing leftovers has turned into weekly community dinners!"
        author="Maria"
        location="Barcelona, Spain"
      />
    </>
  ),

  7: (
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

  8: (
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

  9: (
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

  10: (
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

  11: (
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

  12: (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black aspect-video">
      <LiteYouTubeEmbed videoId="ckhjdrOxBhU" />
    </div>
  ),
};

/** DayContent Component **/
export const DayContent: React.FC<DayContentProps> = ({
  day,
  isVisible,
}) => {
  const content = CONTENT_COMPONENTS[day];

  if (!content) {
    return null;
  }

  // Determine if the day is a video day by checking if content is a video component
  const isVideoDay = [1, 12].includes(day); // Add any video days here

  if (isVideoDay) {
    // For video days, render the content directly
    return content;
  }

  // For other days, render with background and motion effects
  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0 bg-cover bg-center rounded-lg"
        style={{
          backgroundImage: `url(/content/day${day}.jpg)`,
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
            {content}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
