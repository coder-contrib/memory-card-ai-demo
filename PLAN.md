# Plan: Change Card Back Design (Issue #1)

## Issue Summary

**Issue:** [#1 - Change card back design](https://github.com/coder-contrib/memory-card-ai-demo/issues/1)

**Request:** Change the card back design to display a red diamond on all card backs (instead of the current "?" character).

## Current Implementation

In `src/App.jsx:172`, the card back currently displays a question mark character (`?`) when the card is not visible:

```jsx
{isCardVisible(index, card.symbol) ? card.symbol : '?'}
```

The card back has a white background (line 150).

## Proposed Solution

Replace the `?` character with a red diamond symbol. There are two options:

### Option A: Unicode Diamond Character (Recommended)
Use the Unicode red diamond emoji or the diamond suit character styled red:
- `♦` (U+2666 BLACK DIAMOND SUIT) styled with red color
- Or use `🔴` or similar, but diamond is more thematic for cards

### Option B: SVG Diamond
Create an inline SVG diamond shape with red fill.

## Implementation Steps

1. **Modify `src/App.jsx:172`**
   - Replace `'?'` with a diamond symbol
   - Option A: Replace with `<span style={{color: '#e74c3c', fontSize: '56px'}}>♦</span>`
   - This uses the diamond suit character (♦) styled in red

2. **No CSS changes required** - styling is inline

3. **Test visually** - verify the red diamond displays correctly on all unflipped cards

## Files to Modify

- `src/App.jsx` (line 172)

## Estimated Complexity

Low - single line change with inline styling.
