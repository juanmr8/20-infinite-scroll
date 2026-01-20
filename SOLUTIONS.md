# Solutions Guide 🔑

This guide contains reference solutions for each challenge. Try to solve them yourself first!

## Challenge 1: Scroll Detection

```typescript
const handleScroll = () => {
  const container = containerRef.current;
  if (!container) return;

  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;

  const distanceFromTop = scrollTop;
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

  if (distanceFromTop < THRESHOLD) {
    console.log("Near Top");
  } else if (distanceFromBottom < THRESHOLD) {
    console.log("Near Bottom");
  }
};

// In JSX, add dynamic border color:
<div
  style={{
    borderColor: 
      distanceFromTop < THRESHOLD ? "#3b82f6" : 
      distanceFromBottom < THRESHOLD ? "#ef4444" : 
      "#374151"
  }}
>
```

## Challenge 2: Item Reordering

```typescript
const handleScroll = () => {
  const container = containerRef.current;
  if (!container || isMovingRef.current) return;

  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;

  const distanceFromTop = scrollTop;
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

  if (distanceFromBottom < THRESHOLD) {
    isMovingRef.current = true;

    setItems((currentItems) => {
      const movedItems = currentItems.slice(0, ITEMS_TO_MOVE);
      const remainingItems = currentItems.slice(ITEMS_TO_MOVE);
      console.log("Moved to end:", movedItems.map(i => i.id));
      return [...remainingItems, ...movedItems];
    });

    setTimeout(() => {
      isMovingRef.current = false;
    }, 100);
  } else if (distanceFromTop < THRESHOLD) {
    isMovingRef.current = true;

    setItems((currentItems) => {
      const movedItems = currentItems.slice(-ITEMS_TO_MOVE);
      const remainingItems = currentItems.slice(0, -ITEMS_TO_MOVE);
      console.log("Moved to start:", movedItems.map(i => i.id));
      return [...movedItems, ...remainingItems];
    });

    setTimeout(() => {
      isMovingRef.current = false;
    }, 100);
  }
};
```

## Challenge 3: Scroll Position Compensation

```typescript
if (distanceFromBottom < THRESHOLD) {
  isMovingRef.current = true;

  // Measure height before moving
  const itemsContainer = container.querySelector('[data-items-container]');
  const firstItems = Array.from(itemsContainer?.children || []).slice(0, ITEMS_TO_MOVE);
  
  let totalHeight = 0;
  firstItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const style = window.getComputedStyle(item);
    const marginBottom = parseFloat(style.marginBottom);
    totalHeight += rect.height + marginBottom;
  });

  // Move items
  setItems((currentItems) => {
    const movedItems = currentItems.slice(0, ITEMS_TO_MOVE);
    const remainingItems = currentItems.slice(ITEMS_TO_MOVE);
    return [...remainingItems, ...movedItems];
  });

  // Adjust scroll position
  requestAnimationFrame(() => {
    const newScrollTop = scrollTop - totalHeight;
    container.scrollTop = newScrollTop;
    
    setTimeout(() => {
      isMovingRef.current = false;
    }, 100);
  });
}
```

## Challenge 4: Dynamic Loading

```typescript
if (distanceFromBottom < THRESHOLD) {
  isMovingRef.current = true;

  // Cancel previous loading
  if (loadingTimeoutRef.current) {
    clearTimeout(loadingTimeoutRef.current);
  }

  // Measure heights
  const itemsContainer = container.querySelector('[data-items-container]');
  const firstItems = Array.from(itemsContainer?.children || []).slice(0, ITEMS_TO_MOVE);
  
  let totalHeight = 0;
  firstItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const style = window.getComputedStyle(item);
    const marginBottom = parseFloat(style.marginBottom);
    totalHeight += rect.height + marginBottom;
  });

  // Set loading state
  setItems((currentItems) => {
    return currentItems.map((item, index) => {
      if (index < ITEMS_TO_MOVE) {
        return { ...item, isLoading: true };
      }
      return item;
    });
  });

  // After delay, move items and clear loading
  loadingTimeoutRef.current = setTimeout(() => {
    setItems((currentItems) => {
      const movedItems = currentItems.slice(0, ITEMS_TO_MOVE);
      const remainingItems = currentItems.slice(ITEMS_TO_MOVE);
      
      const finalItems = [...remainingItems, ...movedItems].map(item => ({
        ...item,
        isLoading: false
      }));
      
      return finalItems;
    });

    requestAnimationFrame(() => {
      container.scrollTop = scrollTop - totalHeight;
      
      setTimeout(() => {
        isMovingRef.current = false;
      }, 100);
    });
  }, LOADING_DELAY);
}
```

## Challenge 5: Visible Range Calculator

```typescript
const startIndex = Math.max(
  0,
  Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE
);

const endIndex = Math.min(
  TOTAL_ITEMS,
  Math.ceil((scrollTop + CONTAINER_HEIGHT) / ITEM_HEIGHT) + BUFFER_SIZE
);

const topSpacerHeight = startIndex * ITEM_HEIGHT;
const bottomSpacerHeight = (TOTAL_ITEMS - endIndex) * ITEM_HEIGHT;

// In handleScroll:
console.log({
  scrollTop: newScrollTop,
  startIndex,
  endIndex,
  visibleCount: endIndex - startIndex,
});
```

## Challenge 6: Absolute Positioning & Spacers

```typescript
const topSpacerHeight = startIndex * ITEM_HEIGHT;
const bottomSpacerHeight = (TOTAL_ITEMS - endIndex) * ITEM_HEIGHT;

// In JSX:
<div style={{ height: topSpacerHeight }} />

{/* visible items */}

<div style={{ height: bottomSpacerHeight }} />
```

**Alternative approach with absolute positioning:**

```typescript
<div className="relative" style={{ height: TOTAL_ITEMS * ITEM_HEIGHT }}>
  {visibleItems.map((item) => (
    <div
      key={item.id}
      className="absolute w-full"
      style={{ 
        top: item.index * ITEM_HEIGHT, 
        height: ITEM_HEIGHT 
      }}
    >
      {/* item content */}
    </div>
  ))}
</div>
```

## Challenge 7: Infinite + Virtual Hybrid

```typescript
const visibleItems = Array.from(
  { length: endIndex - startIndex },
  (_, i) => {
    const virtualIndex = startIndex + i;
    const actualImageIndex = virtualIndex % UNIQUE_ITEMS;

    return {
      id: `item-${virtualIndex}`,
      virtualIndex,
      actualImageIndex,
      ...IMAGES[actualImageIndex],
    };
  }
);

// BONUS: True infinite scroll with teleportation
const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const newScrollTop = e.currentTarget.scrollTop;
  setScrollTop(newScrollTop);

  const scrollPercentage = newScrollTop / (VIRTUAL_TOTAL * ITEM_HEIGHT);

  if (scrollPercentage > 0.9) {
    const middleScroll = (VIRTUAL_TOTAL * ITEM_HEIGHT) / 2;
    e.currentTarget.scrollTop = middleScroll;
    setScrollTop(middleScroll);
  } else if (scrollPercentage < 0.1 && newScrollTop > 0) {
    const middleScroll = (VIRTUAL_TOTAL * ITEM_HEIGHT) / 2;
    e.currentTarget.scrollTop = middleScroll;
    setScrollTop(middleScroll);
  }
};
```

## Challenge 8: Variable Height Items (Advanced)

```typescript
const [heightCache, setHeightCache] = useState<Map<number, number>>(new Map());

const getItemHeight = (index: number): number => {
  const cached = heightCache.get(index);
  if (cached) return cached;

  const imageIndex = index % IMAGES.length;
  return IMAGES[imageIndex].estimatedHeight;
};

const getItemPosition = (index: number): number => {
  let position = 0;
  for (let i = 0; i < index; i++) {
    position += getItemHeight(i);
  }
  return position;
};

const getTotalHeight = (): number => {
  let total = 0;
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    total += getItemHeight(i);
  }
  return total;
};

const findVisibleRange = (): { start: number; end: number } => {
  let currentPosition = 0;
  let startIndex = 0;
  let endIndex = TOTAL_ITEMS;

  // Find start
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    if (currentPosition + getItemHeight(i) > scrollTop) {
      startIndex = Math.max(0, i - BUFFER_SIZE);
      break;
    }
    currentPosition += getItemHeight(i);
  }

  // Find end
  for (let i = startIndex; i < TOTAL_ITEMS; i++) {
    if (currentPosition > scrollTop + CONTAINER_HEIGHT) {
      endIndex = Math.min(TOTAL_ITEMS, i + BUFFER_SIZE);
      break;
    }
    currentPosition += getItemHeight(i);
  }

  return { start: startIndex, end: endIndex };
};

const measureItem = (index: number, element: HTMLDivElement | null) => {
  if (!element) return;

  const height = element.getBoundingClientRect().height;
  const currentHeight = getItemHeight(index);

  if (Math.abs(height - currentHeight) > 1) {
    setHeightCache(prev => {
      const next = new Map(prev);
      next.set(index, height);
      return next;
    });
  }
};

// In JSX:
<div style={{ height: getItemPosition(startIndex) }} />

{visibleItems.map((item) => (
  <div
    key={item.id}
    ref={(el) => measureItem(item.index, el)}
    style={{ height: item.estimatedHeight }}
  >
    {/* content */}
  </div>
))}

<div style={{ height: getTotalHeight() - getItemPosition(endIndex) }} />
```

## Key Takeaways

### Phase 1: DOM Manipulation
- Scroll detection uses `scrollTop`, `scrollHeight`, `clientHeight`
- Moving items requires measuring heights before reordering
- Scroll compensation prevents visual jumps
- Use refs to prevent infinite loops
- Loading states need proper cleanup

### Phase 2: Virtual Scrolling
- Only render visible items + buffer
- Spacers maintain total scroll height
- Calculate indices using division/ceiling
- Modulo arithmetic creates infinite loops
- Variable heights require caching and cumulative calculations

### Performance Comparison
- DOM Manipulation: O(n) memory, simple logic
- Virtual Scrolling: O(1) memory, complex logic
- Choose based on list size and requirements

## Testing Your Solutions

1. **Visual Test**: Scroll smoothly without jumps
2. **Console Test**: Verify logged values are correct
3. **Performance Test**: Check FPS in DevTools
4. **Edge Cases**: Test rapid scrolling, direction changes
5. **DOM Test**: Inspect rendered elements count

Good luck with your learning journey! 🚀
