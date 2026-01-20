import { useCallback, useState } from "react";

export type VirtualScrollConfig = {
  itemHeight: number;
  containerHeight: number;
  totalItems: number;
  bufferSize?: number;
};

export type VirtualScrollResult = {
  visibleRange: { start: number; end: number };
  topSpacerHeight: number;
  bottomSpacerHeight: number;
  handleScroll: (scrollTop: number) => void;
};

/**
 * Custom hook for virtual scrolling with fixed item heights
 *
 * This hook calculates which items should be rendered based on the
 * current scroll position, significantly improving performance for
 * large lists by only rendering visible items.
 */
export function useVirtualScroll(
  config: VirtualScrollConfig,
): VirtualScrollResult {
  const {
    itemHeight,
    containerHeight,
    totalItems,
    bufferSize = 3,
  } = config;

  const [scrollTop, setScrollTop] = useState(0);

  // Calculate visible range based on scroll position
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - bufferSize,
  );
  const endIndex = Math.min(
    totalItems,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + bufferSize,
  );

  // Calculate spacer heights to maintain scroll position
  const topSpacerHeight = startIndex * itemHeight;
  const bottomSpacerHeight = (totalItems - endIndex) * itemHeight;

  const handleScroll = useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop);
  }, []);

  return {
    visibleRange: { start: startIndex, end: endIndex },
    topSpacerHeight,
    bottomSpacerHeight,
    handleScroll,
  };
}
