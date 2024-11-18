#!/bin/bash

# Array of Christmas-themed image URLs (replace these with actual URLs)
declare -a images=(
  "https://images.unsplash.com/photo-1512389142860-9c449e58a543" # Christmas ornament
  "https://images.unsplash.com/photo-1543589077-47d81606c1bf" # Christmas tree
  "https://images.unsplash.com/photo-1545608444-f045a6db6133" # Gift boxes
  "https://images.unsplash.com/photo-1479722842840-c0a823bd0cd6" # Cookies
  "https://images.unsplash.com/photo-1482517967863-00e15c9b44be" # Hot chocolate
  "https://images.unsplash.com/photo-1511970093628-4e9f59378b4d" # Snow globe
  "https://images.unsplash.com/photo-1514477917009-389c76a86b68" # Candles
  "https://images.unsplash.com/photo-1508558936510-0af1e3cccbab" # Candy canes
  "https://images.unsplash.com/photo-1512474932049-78ac69ede12c" # Gingerbread
  "https://images.unsplash.com/photo-1544654803-b69140b285a1" # Stockings
  "https://images.unsplash.com/photo-1481450112092-f00a4c77e381" # Wreath
  "https://images.unsplash.com/photo-1543258103-a62bdc069871" # Reindeer
  "https://images.unsplash.com/photo-1512389142860-9c449e58a543" # Ornament 2
  "https://images.unsplash.com/photo-1543589077-47d81606c1bf" # Tree 2
  "https://images.unsplash.com/photo-1545608444-f045a6db6133" # Gifts 2
  "https://images.unsplash.com/photo-1479722842840-c0a823bd0cd6" # Cookies 2
  "https://images.unsplash.com/photo-1482517967863-00e15c9b44be" # Hot chocolate 2
  "https://images.unsplash.com/photo-1511970093628-4e9f59378b4d" # Snow globe 2
  "https://images.unsplash.com/photo-1514477917009-389c76a86b68" # Candles 2
  "https://images.unsplash.com/photo-1508558936510-0af1e3cccbab" # Candy canes 2
  "https://images.unsplash.com/photo-1512474932049-78ac69ede12c" # Gingerbread 2
  "https://images.unsplash.com/photo-1544654803-b69140b285a1" # Stockings 2
  "https://images.unsplash.com/photo-1481450112092-f00a4c77e381" # Wreath 2
  "https://images.unsplash.com/photo-1543258103-a62bdc069871" # Reindeer 2
  "https://images.unsplash.com/photo-1577022159920-0a26325d2572" # Christmas Day
)

# Download each image
for i in "${!images[@]}"; do
  index=$((i + 1))
  echo "Downloading image $index..."
  curl -L "${images[$i]}" -o "../public/images/day$index.jpg"
  sleep 1  # Add a small delay to avoid rate limiting
done

echo "All images downloaded!"
