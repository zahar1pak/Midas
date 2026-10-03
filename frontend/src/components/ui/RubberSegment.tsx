import React, { useLayoutEffect, useRef, useState, useCallback, useEffect } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import './RubberSegment.css';

const anim: any = animate;

const SPRING_UI = { type: 'spring', duration: 0.38, bounce: 0.15 };
const SIZES: Record<string, { height: number; font: number; pad: number; min: number }> = {
  sm: { height: 32, font: 12, pad: 12, min: 36 },
  md: { height: 40, font: 13, pad: 16, min: 44 },
  lg: { height: 46, font: 14, pad: 18, min: 48 }
};

export interface RubberSegmentItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface RubberSegmentProps {
  items: (string | RubberSegmentItem)[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, index: number) => void;
  trackColor?: string;
  thumbColor?: string;
  textColor?: string;
  activeTextColor?: string;
  size?: 'sm' | 'md' | 'lg';
  radius?: number;
  inset?: number;
  equalSlots?: boolean;
  stretch?: number;
  squash?: number;
  speed?: number;
  className?: string;
}

export default function RubberSegment({
  items,
  value,
  defaultValue,
  onChange,
  trackColor = '#151322',
  thumbColor = '#C6FF33',
  textColor = '#8E8A9E',
  activeTextColor = '#0A0910',
  size = 'md',
  radius = 9999,
  inset = 3,
  equalSlots = true,
  stretch = 50,
  squash = 2,
  speed = 1,
  className = ''
}: RubberSegmentProps) {
  const list: RubberSegmentItem[] = items.map(item =>
    typeof item === 'string' ? { value: item, label: item } : item
  );
  
  const [inner, setInner] = useState(defaultValue ?? list[0]?.value);
  const current = value !== undefined ? value : inner;
  const index = Math.max(
    0,
    list.findIndex(item => item.value === current)
  );

  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const slots = useRef<{ l: number; w: number }[]>([]);
  const committed = useRef(index);

  const thumbLeft = useMotionValue(0);
  const thumbWidth = useMotionValue(0);
  const thumbRadius = Math.max(0, radius - inset);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    slots.current = list.map((_, i) => {
      const el = itemRefs.current[i];
      if (!el) return { l: 0, w: 0 };
      const r = el.getBoundingClientRect();
      return {
        l: r.left - trackRect.left,
        w: r.width
      };
    });

    const activeSlot = slots.current[committed.current] || slots.current[0];
    if (activeSlot && activeSlot.w > 0) {
      thumbLeft.jump(activeSlot.l);
      thumbWidth.jump(activeSlot.w);
    }
  }, [list, thumbLeft, thumbWidth]);

  const listKey = list.map(item => item.value).join('|');
  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [listKey, size, inset, equalSlots, measure]);

  const glideTo = useCallback((fromIndex: number, targetIndex: number) => {
    const a = slots.current[fromIndex];
    const b = slots.current[targetIndex];
    if (!b || b.w === 0) return;
    committed.current = targetIndex;

    if (reduce || !a) {
      thumbLeft.jump(b.l);
      thumbWidth.jump(b.w);
      return;
    }

    // Organic stretch / squash animation
    const u = stretch / 100;
    const movingRight = b.l > a.l;
    const stretchedWidth = b.w + Math.abs(b.l - a.l) * (u * 0.45);

    // 1. Expand width towards movement direction
    anim(thumbWidth, stretchedWidth, { duration: 0.16 / speed, ease: [0.23, 1, 0.32, 1] }).then(() => {
      anim(thumbWidth, b.w, { ...SPRING_UI, duration: 0.28 / speed });
    });

    // 2. Slide left position with squash spring
    const targetL = movingRight ? b.l + squash : Math.max(inset, b.l - squash);
    anim(thumbLeft, targetL, { duration: 0.22 / speed, ease: [0.23, 1, 0.32, 1] }).then(() => {
      anim(thumbLeft, b.l, { ...SPRING_UI, duration: 0.26 / speed });
    });
  }, [thumbLeft, thumbWidth, reduce, stretch, squash, speed, inset]);

  useEffect(() => {
    if (committed.current !== index) {
      glideTo(committed.current, index);
    }
  }, [index, glideTo]);

  const handleClick = (i: number) => {
    if (i === index) return;
    const from = committed.current;
    const item = list[i];
    if (!item) return;

    if (value === undefined) {
      setInner(item.value);
    }
    glideTo(from, i);
    onChange?.(item.value, i);
  };

  const preset = SIZES[size] || SIZES.md;

  return (
    <div
      ref={trackRef}
      role="radiogroup"
      data-equal={equalSlots ? '' : undefined}
      className={`rubber-segment${className ? ` ${className}` : ''}`}
      style={{
        // @ts-ignore
        '--rs-track': trackColor,
        '--rs-thumb': thumbColor,
        '--rs-ink': textColor,
        '--rs-ink-active': activeTextColor,
        '--rs-radius': `${radius}px`,
        '--rs-inset': `${inset}px`,
        '--rs-thumb-radius': `${thumbRadius}px`,
        '--rs-h': `${preset.height}px`,
        '--rs-font': `${preset.font}px`,
        '--rs-pad': `${preset.pad}px`,
        '--rs-min': `${preset.min}px`
      }}
    >
      {/* Animated Rubber Thumb Pill */}
      <motion.div
        className="rubber-segment__thumb-pill"
        style={{
          left: thumbLeft,
          width: thumbWidth
        }}
      />

      {/* Segment Buttons */}
      {list.map((item, i) => {
        const isSelected = i === index;
        return (
          <button
            key={item.value}
            ref={el => {
              itemRefs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className="rubber-segment__item"
            onClick={() => handleClick(i)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
