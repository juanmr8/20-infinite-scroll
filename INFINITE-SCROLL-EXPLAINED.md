# Infinite Scroll Effect - How It Works
**AI GENERATED**
## Core Concept

The infinite scroll creates a **seamless looping gallery** by duplicating content and using modulo math to "teleport" the container position when it reaches a threshold — without the user noticing.

## The Setup

1. **Duplicate the content twice** in the DOM
2. **Wrap the scroll position** at the halfway point using modulo
3. **The visual content is identical** at position 0 and position `halfHeight`

## The Math: Positive Modulo

```javascript
const wrapped = ((scrollY % halfHeight) + halfHeight) % halfHeight;
const yTranslation = -wrapped;
```

This is called **"positive modulo"** or **"Euclidean modulo"** — it ensures the result is always in the range `[0, halfHeight)`, even for negative values.

### Why the Double Modulo?

JavaScript's `%` operator can return negative values:

```javascript
-5 % 3 = -2  // JavaScript (truncated modulo)
```

The pattern `((x % n) + n) % n` fixes this:

1. `x % n` — Get the remainder (may be negative)
2. `+ n` — Make it positive
3. `% n` — Bring it back into range `[0, n)`

## Simple Example

Imagine **3 images**, each **5px tall**, duplicated twice:

```
Container (30px total):
Position 0px:   [Image A] ← Copy 1
Position 5px:   [Image B]
Position 10px:  [Image C]
Position 15px:  [Image A] ← Copy 2 (IDENTICAL to position 0)
Position 20px:  [Image B]
Position 25px:  [Image C]
```

**halfHeight = 15px** (the wrap point)

### The Scroll Timeline

```
scrollY = 0   → yTranslation = 0px    (shows Image A from Copy 1)
scrollY = 7   → yTranslation = -7px   (shows Image B from Copy 1)
scrollY = 14  → yTranslation = -14px  (shows near Image A from Copy 2)
scrollY = 15  → yTranslation = 0px    (WRAP! Shows Image A from Copy 1)
scrollY = 16  → yTranslation = -1px   (continues seamlessly)
```

At `scrollY = 15`, the container **jumps from -15px back to 0px**, but the user sees **no visual change** because:
- Position 0px shows Image A
- Position 15px shows Image A (from Copy 2)

They're visually identical!

## Why We Need Two Copies

**Question:** If we wrap back to 0, why not just use one copy?

**Answer:** Copy 2 provides **content to display while approaching the wrap point**.

Without Copy 2:
- Container would only be 15px tall
- At `scrollY = 14`, you'd hit the end with nothing to show
- The wrap would be a visible jump

With Copy 2:
- Container is 30px tall
- At `scrollY = 14`, you show content at position 14px (Image A from Copy 2)
- At `scrollY = 15`, you wrap to position 0 (Image A from Copy 1)
- The transition is seamless because both positions show Image A

## The Key Insight

The second copy isn't for the wrap itself — it's the **buffer** that ensures there's always content to display before the modulo resets the position.

Think of it like a barber pole: the stripes repeat, so when it loops back, you can't tell it happened.

## Visual Timeline

```
scrollY:  0    15    30    45    60
          ↓     ↓     ↓     ↓     ↓
yTrans:   0 → -15 →  0 → -15 →  0
               ↑           ↑
             WRAP!       WRAP!
```

The container physically teleports every 15px, but the visual content is identical at each wrap point, making the loop invisible.
