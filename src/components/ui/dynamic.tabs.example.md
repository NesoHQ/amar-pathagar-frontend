# DynamicTabs Component

A sophisticated, reusable tabs component with mobile-first design.

## Features

- ✅ Responsive design (horizontal scroll on mobile, grid on desktop)
- ✅ Badge support for counts
- ✅ Icon support
- ✅ Active state indicators
- ✅ Theme-aware styling
- ✅ Disabled state support
- ✅ Smooth transitions
- ✅ Accessible

## Basic Usage

```tsx
import { DynamicTabs, DynamicTabContent } from '@/components/ui/dynamic.tabs';

function MyComponent() {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <DynamicTabs
      defaultValue="tab1"
      tabs={[
        { value: 'tab1', label: 'Tab 1' },
        { value: 'tab2', label: 'Tab 2' },
      ]}
      onTabChange={setActiveTab}
    >
      {activeTab === 'tab1' && (
        <DynamicTabContent value="tab1">
          <p>Content for Tab 1</p>
        </DynamicTabContent>
      )}
      
      {activeTab === 'tab2' && (
        <DynamicTabContent value="tab2">
          <p>Content for Tab 2</p>
        </DynamicTabContent>
      )}
    </DynamicTabs>
  );
}
```

## With Icons and Counts

```tsx
<DynamicTabs
  defaultValue="reviews"
  tabs={[
    { value: 'reviews', label: 'Reviews', count: 25, icon: '⭐' },
    { value: 'comments', label: 'Comments', count: 10, icon: '💬' },
    { value: 'likes', label: 'Likes', count: 100, icon: '❤️' },
  ]}
  onTabChange={(value) => console.log('Tab changed to:', value)}
>
  {/* Tab content here */}
</DynamicTabs>
```

## With Disabled Tabs

```tsx
<DynamicTabs
  defaultValue="tab1"
  tabs={[
    { value: 'tab1', label: 'Available' },
    { value: 'tab2', label: 'Coming Soon', disabled: true },
    { value: 'tab3', label: 'Active' },
  ]}
>
  {/* Tab content here */}
</DynamicTabs>
```

## Props

### DynamicTabs

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `defaultValue` | `string` | Yes | Initial active tab value |
| `tabs` | `Tab[]` | Yes | Array of tab configurations |
| `children` | `ReactNode` | Yes | Tab content components |
| `className` | `string` | No | Additional CSS classes |
| `onTabChange` | `(value: string) => void` | No | Callback when tab changes |

### Tab Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `value` | `string` | Yes | Unique identifier for the tab |
| `label` | `string` | Yes | Display text for the tab |
| `count` | `number` | No | Badge count to display |
| `icon` | `string` | No | Emoji or icon to display |
| `disabled` | `boolean` | No | Whether the tab is disabled |

### DynamicTabContent

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | Yes | Tab value this content belongs to |
| `children` | `ReactNode` | Yes | Content to display |
| `className` | `string` | No | Additional CSS classes |

## Mobile vs Desktop Behavior

### Mobile (< 768px)
- Horizontal scrolling tabs
- Compact spacing
- Touch-friendly tap targets
- Smooth scroll behavior

### Desktop (≥ 768px)
- Full-width grid layout
- Equal width tabs
- Active indicator line at bottom
- Hover effects

## Styling

The component uses CSS variables for theming:
- `--primary`: Active tab background
- `--primary-foreground`: Active tab text
- `--card`: Inactive tab background
- `--foreground`: Inactive tab text
- `--border`: Tab borders

## Best Practices

1. **Keep tab labels short** - Especially for mobile
2. **Use icons for visual clarity** - Helps users quickly identify tabs
3. **Show counts when relevant** - Provides context at a glance
4. **Limit number of tabs** - 2-5 tabs work best for mobile
5. **Use conditional rendering** - Only render active tab content for performance

## Real-World Example

See `src/app/books/[id]/page.tsx` for a complete implementation with:
- Reviews and Discussions tabs
- Dynamic counts
- Icons
- Sorting and filtering within tabs
- Load more functionality
