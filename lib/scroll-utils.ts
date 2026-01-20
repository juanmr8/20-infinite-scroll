/**
 * Shared utilities for infinite scroll implementations
 */

/**
 * Calculate scroll position metrics
 */
export function getScrollMetrics(container: HTMLElement) {
  return {
    scrollTop: container.scrollTop,
    scrollHeight: container.scrollHeight,
    clientHeight: container.clientHeight,
    distanceFromTop: container.scrollTop,
    distanceFromBottom:
      container.scrollHeight - container.scrollTop - container.clientHeight,
  };
}

/**
 * Check if scrolled near edge
 */
export function isNearEdge(
  container: HTMLElement,
  threshold: number = 300,
): { nearTop: boolean; nearBottom: boolean } {
  const metrics = getScrollMetrics(container);

  return {
    nearTop: metrics.distanceFromTop < threshold,
    nearBottom: metrics.distanceFromBottom < threshold,
  };
}

/**
 * Measure total height of DOM elements including margins
 */
export function measureElementsHeight(elements: Element[]): number {
  return elements.reduce((total, element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const marginBottom = parseFloat(style.marginBottom) || 0;
    return total + rect.height + marginBottom;
  }, 0);
}

/**
 * Calculate visible range for virtual scrolling with fixed heights
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  bufferSize: number = 3,
): { start: number; end: number } {
  const start = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - bufferSize,
  );
  const end = Math.min(
    totalItems,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + bufferSize,
  );

  return { start, end };
}

/**
 * Calculate spacer heights for virtual scrolling
 */
export function calculateSpacerHeights(
  startIndex: number,
  endIndex: number,
  itemHeight: number,
  totalItems: number,
): { top: number; bottom: number } {
  return {
    top: startIndex * itemHeight,
    bottom: (totalItems - endIndex) * itemHeight,
  };
}

/**
 * Map virtual index to actual index using modulo (for infinite scroll)
 */
export function getCircularIndex(virtualIndex: number, totalItems: number): number {
  return Math.abs(virtualIndex) % totalItems;
}
