import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from '../utils/animations';
import { Emoji } from '../components/Emoji';
import { LiteYouTubeEmbed } from '../components/LiteYouTubeEmbed';
import { AudioPlayer } from '../components/AudioPlayer';

type DayContentProps = {
  onVideoEnd?: () => void;
  reload?: boolean;
  key?: string | number;
};

export const DAY_CONTENT: Record<
  number,
  (props?: DayContentProps) => React.ReactNode
> = {
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
        Those meals fed 168,700 households
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
        We saved 8.5 billion litres of water
      </motion.h2>

      <Emoji name="💧🏊‍♀️" />

      <motion.h3
        className="text-2xl md:text-3xl font-semibold drop-shadow-md"
        variants={itemVariants}
      >
        Which is enough to fill 3,400 Olympic swimming pools!
      </motion.h3>
    </>
  ),

  5: () => (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        We diverted 50,000 tonnes of Co2 from the atmosphere
      </motion.h2>
      <Emoji name="⛅️" />
      <motion.h3
        className="text-2xl md:text-3xl font-semibold drop-shadow-md"
        variants={itemVariants}
      >
        Which is the same as cancelling out 170 flights from London to
        New York
      </motion.h3>
    </>
  ),

  6: () => (
    <>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        And amazingly...
      </motion.h2>
      <motion.h2
        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
        variants={itemVariants}
      >
        We've just hit 100 million meals rescued
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

  7: () => (
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

  8: () => (
    <>
      <motion.div
        className=" rounded-lg p-80 h-90 w-90 bg-cover bg-[url('/content/day8-quote.jpg')]"
        variants={itemVariants}
      >
        &nbsp;
      </motion.div>
    </>
  ),

  9: () => (
    <>
      <motion.div
        className=" rounded-lg p-80 h-90 w-90 bg-cover bg-[url('/content/day9-quote.jpg')]"
        variants={itemVariants}
      >
        &nbsp;
      </motion.div>
    </>
  ),

  10: () => (
    <>
      <motion.div
        className=" rounded-lg p-80 h-full bg-cover bg-[url('/content/day10-quote.jpg')]"
        variants={itemVariants}
      >
        &nbsp;
      </motion.div>
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

  12: (props?: DayContentProps) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <LiteYouTubeEmbed
        videoId="SBgoNiiC7UM"
        onVideoEnd={props?.onVideoEnd}
        reload={props?.reload}
      />
    </div>
  ),
};

export const DAY_EFFECTS: Partial<
  Record<number, { effect: 'confetti' | 'hearts' }>
> = {
  1: { effect: 'hearts' },
  2: { effect: 'confetti' },
  6: { effect: 'confetti' },
  7: { effect: 'hearts' },
  11: { effect: 'confetti' },
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
