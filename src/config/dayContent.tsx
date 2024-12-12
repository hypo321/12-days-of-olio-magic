import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from '../utils/animations';
import { Emoji } from '../components/Emoji';
import { AudioPlayer } from '../components/AudioPlayer';
import { VideoPlayer } from '../components/VideoPlayer';

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
      <motion.h2 className="hero" variants={itemVariants}>
        Welcome!
      </motion.h2>
      <motion.p> </motion.p>
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
      <motion.h3 className="h2" variants={itemVariants}>
        We rescued
      </motion.h3>
      <motion.h2 className="hero" variants={itemVariants}>
        30 million meals
      </motion.h2>
      <motion.h2 className="h2" variants={itemVariants}>
        in 12 months
      </motion.h2>
      <Emoji name="🥳" />
    </>
  ),

  3: () => (
    <>
      <motion.h2 className="h2" variants={itemVariants}>
        Those meals fed
      </motion.h2>
      <motion.h2 className="hero" variants={itemVariants}>
        168,700 households
      </motion.h2>

      <motion.h3 className="h3" variants={itemVariants}>
        in UK and Irish communities
      </motion.h3>

      <Emoji name="🏡🥘" />
    </>
  ),

  4: () => (
    <>
      <motion.h2 className="h2" variants={itemVariants}>
        We saved
      </motion.h2>
      <motion.h2 className="hero" variants={itemVariants}>
        8.5 billion
      </motion.h2>
      <motion.h2 className="h2" variants={itemVariants}>
        litres of water
      </motion.h2>

      <Emoji name="💧🏊‍♀️" />
      <motion.h3 className="h3" variants={itemVariants}>
        That's enough to fill 3,400 Olympic swimming pools!
      </motion.h3>
    </>
  ),

  5: () => (
    <>
      <motion.h2 className="h2" variants={itemVariants}>
        We diverted
      </motion.h2>
      <motion.h2 className="hero" variants={itemVariants}>
        50,000
      </motion.h2>
      <motion.h2 className="h2" variants={itemVariants}>
        tonnes of Co2 from the atmosphere
      </motion.h2>

      <Emoji name="⛅️" />
      <motion.h3 className="h3" variants={itemVariants}>
        That's like grounding 170 flights from London to New York
      </motion.h3>
    </>
  ),

  6: () => (
    <>
      <motion.h2 className="h2" variants={itemVariants}>
        And amazingly, we've just hit
      </motion.h2>
      <motion.h2 className="hero" variants={itemVariants}>
        100 million
      </motion.h2>
      <motion.h2 className="h2" variants={itemVariants}>
        meals rescued
      </motion.h2>

      <motion.h3 className="h3" variants={itemVariants}>
        since we were first founded in 2015
      </motion.h3>
      <div
        style={{
          position: 'relative',
          width: '100px',
          height: '100px',
          overflow: 'visible',
        }}
      >
        {/* Rocket */}
        <motion.div
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            // Enhanced jitter with rapid shake before takeoff
            x: [
              0, -0.3, 0.3, -0.3, 0.3, -0.3, 0.3, -0.3, 0.3, -0.3, -7,
              1000, 1000, -1000, 0,
            ],
            y: [
              0, 0.3, -0.3, 0.3, -0.3, 0.3, -0.3, 0.3, -0.3, 0.3, 7,
              -1000, -1000, 1000, 0,
            ],
            opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
          }}
          transition={{
            duration: 3,
            times: [
              // Increased frequency for rapid jitter at the beginning
              0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.45, 0.5,
              0.55, 0.7, 0.75, 0.8, 1,
            ],
            ease: 'anticipate',
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          style={{ position: 'absolute' }}
        >
          <Emoji name="🚀" />
        </motion.div>
      </div>
    </>
  ),

  7: () => (
    <>
      <motion.h2 className="h2" variants={itemVariants}>
        But those numbers mean nothing...
      </motion.h2>
      <motion.h3 className="h3" variants={itemVariants}>
        without a snapshot of the human impact we're having
      </motion.h3>

      <Emoji name="🫶" />
    </>
  ),

  8: () => (
    <>
      <motion.div
        className="rounded-lg overflow-hidden drop-shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        <motion.img
          src="/content/day8-quote.jpg"
          className="w-full h-auto object-contain max-h-[80vh]"
          variants={itemVariants}
          alt="Day 8 quote"
        />
      </motion.div>
    </>
  ),

  9: () => (
    <>
      <motion.div
        className="rounded-lg overflow-hidden drop-shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        <motion.img
          src="/content/day9-quote.jpg"
          className="w-full h-auto object-contain max-h-[80vh]"
          variants={itemVariants}
          alt="Day 9 quote"
        />
      </motion.div>
    </>
  ),

  10: () => (
    <>
      <motion.div
        className="rounded-lg overflow-hidden drop-shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        <motion.img
          src="/content/day10-quote.jpg"
          className="w-full h-auto object-contain max-h-[80vh]"
          variants={itemVariants}
          alt="Day 10 quote"
        />
      </motion.div>
    </>
  ),

  11: () => (
    <>
      <motion.h2 className="h2" variants={itemVariants}>
        Let’s make 2025 our biggest year yet
      </motion.h2>
      <motion.div
        animate={{
          y: [0, -15, 0, -10, 0],
        }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          delay: 1,
          repeatDelay: 2,
          times: [0, 0.25, 0.5, 0.75, 1],
          ease: 'easeInOut',
        }}
      >
        <Emoji name="🤝" />
      </motion.div>
    </>
  ),

  12: (props?: DayContentProps) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <VideoPlayer
        src="/content/Meet Olio_ Your Local Sharing App.mp4"
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
  12: 'bg-olio-lilac',
};
