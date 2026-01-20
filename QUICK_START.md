# Quick Start Guide 🚀

Get started with the Infinite Scroll Learning Path in 3 steps!

## Step 1: Start the Dev Server

```bash
cd /Users/juanmoraromero/Dev/0-dojo/lab/20-infinite-scroll
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 2: Choose Your First Challenge

You'll see a beautiful menu with all challenges. Start with **Challenge 1: Scroll Detection**.

## Step 3: Complete the Challenge

### For Each Challenge:

1. **Read the on-screen instructions** - Each challenge shows:
   - Clear tasks to complete
   - Hints and tips
   - What you'll learn

2. **Open the component file** - Located in `components/`:
   - Challenge 1: `dom-infinite-scroll.tsx`
   - Challenge 2: `dom-infinite-scroll-2.tsx`
   - Challenge 3: `dom-infinite-scroll-3.tsx`
   - ...and so on

3. **Find the TODOs** - Look for:
   ```typescript
   // TODO: Your task here
   // Hints and formulas provided
   ```

4. **Write the code** - Uncomment and complete the TODO sections

5. **Test in browser** - Save the file and watch it work!

6. **Verify** - Check:
   - ✅ Visual behavior (scroll smoothly)
   - ✅ Console logs (open DevTools)
   - ✅ DOM inspector (see elements)

## Challenge Overview

### 🔵 Phase 1: DOM Manipulation (Beginner-Friendly)
1. **Challenge 1** - Detect scroll position (10 min)
2. **Challenge 2** - Move items around (15 min)
3. **Challenge 3** - Fix scroll jumps (20 min)
4. **Challenge 4** - Add loading states (25 min)

### 🟣 Phase 2: Virtual Scrolling (Production-Ready)
5. **Foundation** - See virtual scrolling in action (5 min)
6. **Challenge 5** - Calculate visible range (15 min)
7. **Challenge 6** - Position items with spacers (15 min)
8. **Challenge 7** - Infinite + virtual hybrid (30 min)
9. **Challenge 8** - Variable heights (45 min - Advanced!)

## Quick Tips

### Getting Stuck?
1. Read the hints in the TODO comments
2. Check the console for errors
3. Look at `SOLUTIONS.md` for reference
4. Examine `use-virtual-scroll.ts` for a working example

### Debugging Tools
- **Console**: `Cmd+Option+J` (Mac) or `F12` (Windows)
- **Elements**: Inspect DOM changes in real-time
- **Performance**: Record to see scroll performance

### Navigation
- **Back to Menu**: Click button in top-left
- **Jump Between Challenges**: Click numbered buttons in top-right
- **Keyboard**: Arrow keys work in most places

## Example: Challenge 1 Solution Peek

Here's what you'll implement in Challenge 1:

```typescript
const handleScroll = () => {
  const container = containerRef.current;
  if (!container) return;

  // Get scroll values
  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;

  // Calculate distances
  const distanceFromTop = scrollTop;
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

  // Check thresholds
  if (distanceFromTop < 300) {
    console.log("Near Top");
  } else if (distanceFromBottom < 300) {
    console.log("Near Bottom");
  }
};
```

Simple, right? 😊

## Learning Path

```
Start Here → Challenge 1 → Challenge 2 → Challenge 3 → Challenge 4
                                                           ↓
                                                     Foundation
                                                           ↓
              Challenge 8 ← Challenge 7 ← Challenge 6 ← Challenge 5
              (Advanced)                               (Continue)
```

## Resources

- **README.md** - Complete documentation
- **SOLUTIONS.md** - Reference solutions (try first!)
- **lib/scroll-utils.ts** - Helper functions
- **hooks/use-virtual-scroll.ts** - Working hook example

## What You'll Learn

By the end, you'll understand:
- ✅ How infinite scroll actually works
- ✅ When to use DOM vs virtual scrolling
- ✅ Performance optimization techniques
- ✅ Real-world implementation strategies

## Next Steps After Completion

Apply these concepts to:
- 📱 Social media feeds
- 🛒 E-commerce product lists
- 💬 Chat message history
- 📊 Data tables
- 🖼️ Image galleries
- 🎬 Video playlists

---

**Ready?** Start the dev server and begin your journey! 🎉

```bash
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000)
