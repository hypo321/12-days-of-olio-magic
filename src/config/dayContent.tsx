import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from '../utils/animations';
import { Emoji } from '../components/Emoji';
import { StatsGrid } from '../components/StatsGrid';
import { QuoteBlock } from '../components/QuoteBlock';
import { LiteYouTubeEmbed } from '../components/LiteYouTubeEmbed';
import { AudioPlayer } from '../components/AudioPlayer';

export const DAY_CONTENT: Record<number, () => React.ReactNode> = {
  1: () => (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        Welcome!
      </motion.h2>
      <AudioPlayer fileName="welcome.mp3" play />
      <motion.p
        className="text-lg md:text-xl space-y-4 drop-shadow-md"
        variants={itemVariants}
      >
        A message from Olio founders, Tessa and Saasha
      </motion.p>
    </>
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
        Let’s make 2025 our biggest year yet
      </motion.h2>

      <Emoji name="🤝" />
    </>
  ),

  12: () => (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black aspect-video">
      <LiteYouTubeEmbed videoId="ckhjdrOxBhU" />
    </div>
  ),
};

export const DAY_EFFECTS: Partial<
  Record<number, { effect: 'confetti' | 'hearts' }>
> = {
  1: { effect: 'hearts' },
  2: { effect: 'confetti' },
  5: { effect: 'confetti' },
  6: { effect: 'hearts' },
};

export const DAY_BACKGROUNDS: Partial<
  Record<number, 'bg-olio-yellow' | 'bg-olio-lilac' | 'bg-olio-pink'>
> = {
  1: 'bg-olio-lilac',
  2: 'bg-olio-yellow',
  3: 'bg-olio-lilac',
  4: 'bg-olio-yellow',
  5: 'bg-olio-lilac',
  6: 'bg-olio-yellow',
  7: 'bg-olio-lilac',
  8: 'bg-olio-yellow',
  9: 'bg-olio-lilac',
  10: 'bg-olio-yellow',
  11: 'bg-olio-pink',
  12: 'bg-olio-yellow',
};
