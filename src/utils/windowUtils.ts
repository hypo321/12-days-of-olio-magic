// src/utils/windowUtils.ts
export const getViewportSize = () => {
  return {
    width: window.visualViewport?.width || window.innerWidth,
    height: window.visualViewport?.height || window.innerHeight,
  };
};
