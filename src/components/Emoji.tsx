import { motion } from 'framer-motion';
import { itemVariants } from '../utils/animations';

// For image-based emojis
type ImageEmojiName = 'party' | 'swimmer' | 'sun-behind-cloud';
// Add more image emoji names as needed

interface EmojiProps {
  name: ImageEmojiName | string; // Allow any string for text emojis
  className?: string;
}

export const Emoji: React.FC<EmojiProps> = ({
  name,
  className = '',
}) => {
  // Helper to check if a name is an image emoji
  const isImageEmoji = (name: string): name is ImageEmojiName => {
    return ['party', 'swimmer', 'sun-behind-cloud'].includes(name);
  };

  // Helper to check if a string contains only emoji characters
  const isEmojiCharacter = (str: string) => {
    const emojiRegex =
      /(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}(?:\p{Emoji_Modifier})?)/u;
    return emojiRegex.test(str);
  };

  if (isImageEmoji(name)) {
    // Render image-based emoji
    return (
      <motion.img
        src={`/content/${name}.png`}
        alt={name.replace(/-/g, ' ')}
        className={`mt-4 mx-auto rounded-lg max-w-full ${className}`}
        variants={itemVariants}
      />
    );
  } else if (isEmojiCharacter(name)) {
    // Render text-based emoji
    return (
      <motion.span
        className={`text-8xl sm:text-9xl md:text-10xl lg:text-10xl block ${className}`}
        variants={itemVariants}
        role="img"
        aria-label={name}
      >
        {name}
      </motion.span>
    );
  }

  // If it's neither an image emoji nor a valid emoji character,
  // render as text (useful for development/fallback)
  return (
    <motion.span
      className={`mt-4 block ${className}`}
      variants={itemVariants}
    >
      {name}
    </motion.span>
  );
};
