# Silk Thread Boutique

**Silk Thread Boutique** specializes in handmade and customized products, mainly focusing on silk thread-based accessories and decorative items. We craft premium, unique pieces tailored to our customers' tastes.

## Design System

### Fonts
*   **Headings:** Cinzel
*   **Body Text:** Outfit
*   **Serif Accents:** Roboto Serif

### Color Palette
| Color Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Deep Bronze** | `#6D4A11` | Primary Brand Color |
| **Gold** | `#DFA64B` | Secondary Elements |
| **Pale Gold** | `#FBE285` | Accents & Highlights |
| **Black** | `#000000` | Text / Foreground |
| **White** | `#FFFFFF` | Background |

### Layout
The `.sizer` utility class ensures a consistent, centered layout across the site. Do not use it in the `layout.tsx` or `body`. Instead, apply it to the container `div` inside each `section`:

```html
<section>
  <div className="sizer">
    <!-- Section content goes here -->
  </div>
</section>
```

```css
.sizer {
  width: 97%;
  max-width: 1200px;
  margin: auto;
}
```

---

## Utilities

### Currency Formatting (`utils/format.ts`)

The `formatCurrency` utility provides consistent currency formatting across the app using Indian Rupee (₹) and the Indian numbering system.

```typescript
import { formatCurrency, formatPrice } from '@/utils/format';

// Basic usage
formatCurrency(1500)           // "₹1,500"
formatCurrency(150000)         // "₹1,50,000"

// Without symbol
formatCurrency(1500, { showSymbol: false })  // "1,500"

// With decimals
formatCurrency(1500.50, { maximumFractionDigits: 2 })  // "₹1,500.50"

// Price with sale
formatPrice(2000, 1500)
// {
//   price: "₹2,000",
//   salePrice: "₹1,500",
//   discount: 25,
//   savings: "₹500",
//   hasSale: true
// }
```

---

## UI Components

### Badge Component (`components/ui/Badge.tsx`)

Reusable badge component for product labels with predefined variants.

```tsx
import Badge, { RibbonBadge, DiscountBadge, NewBadge, SaleBadge } from '@/components/ui/Badge';

// Variants
<Badge variant="ribbon">New Arrival</Badge>     // Gold (secondary)
<Badge variant="discount">25% OFF</Badge>       // Red
<Badge variant="new">New</Badge>                 // Green
<Badge variant="sale">Sale</Badge>               // Orange

// Convenience components
<RibbonBadge>Featured</RibbonBadge>
<DiscountBadge percent={25} />                  // Shows "25% OFF"
<NewBadge />                                     // Shows "New"
<SaleBadge />                                    // Shows "Sale"
```

| Variant | Color | Tailwind Class |
|---------|-------|----------------|
| `ribbon` | Gold | `bg-secondary text-white` |
| `discount` | Red | `bg-red-500 text-white` |
| `new` | Green | `bg-emerald-500 text-white` |
| `sale` | Orange | `bg-orange-500 text-white` |
