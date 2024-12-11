// src/utils/windowUtils.ts
export const getViewportSize = () => {
  const container = document.querySelector('.calendar-container');
  if (container) {
    const rect = container.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
    };
  }
  // Fallback to window dimensions if container is not found
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};
