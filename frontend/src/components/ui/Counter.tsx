import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';
import './Counter.css';

interface NumberProps {
  mv: any;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps) {
  const y = useTransform(mv, (latest: number) => {
    const placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });
  return (
    <motion.span className="counter-number" style={{ y }}>
      {number}
    </motion.span>
  );
}

function normalizeNearInteger(num: number) {
  const nearest = Math.round(num);
  const tolerance = 1e-9 * Math.max(1, Math.abs(num));
  return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function getValueRoundedToPlace(value: number, place: number) {
  const scaled = value / place;
  return Math.floor(normalizeNearInteger(scaled));
}

interface DigitProps {
  place: number | string;
  value: number;
  height: number;
  digitStyle?: React.CSSProperties;
}

function Digit({ place, value, height, digitStyle }: DigitProps) {
  const isDecimal = place === '.' || place === ' ';
  const numPlace = typeof place === 'number' ? place : 1;
  const valueRoundedToPlace = isDecimal ? 0 : getValueRoundedToPlace(value, numPlace);
  const animatedValue = useSpring(valueRoundedToPlace, { stiffness: 180, damping: 20 });

  useEffect(() => {
    if (!isDecimal) {
      animatedValue.set(valueRoundedToPlace);
    }
  }, [animatedValue, valueRoundedToPlace, isDecimal]);

  if (isDecimal) {
    return (
      <span className="counter-digit" style={{ height, ...digitStyle, width: '0.45ch', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {place}
      </span>
    );
  }

  return (
    <span className="counter-digit" style={{ height, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </span>
  );
}

export interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: (number | string)[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: string | number;
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: React.CSSProperties;
  bottomGradientStyle?: React.CSSProperties;
}

export default function Counter({
  value,
  fontSize = 32,
  padding = 0,
  places,
  gap = 2,
  borderRadius = 4,
  horizontalPadding = 0,
  textColor = 'inherit',
  fontWeight = 900,
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 0,
  gradientFrom = 'transparent',
  gradientTo = 'transparent',
  topGradientStyle,
  bottomGradientStyle
}: CounterProps) {
  const height = fontSize + padding;
  const absVal = Math.abs(Math.round(value));

  // Compute places with space thousands separator if not explicitly given
  const computedPlaces = places || (() => {
    const str = absVal.toLocaleString('en-US'); // e.g. "72,000"
    const digitsOnly = absVal.toString();
    let digitIdx = 0;
    const res: (number | string)[] = [];
    for (let i = 0; i < str.length; i++) {
      if (str[i] === ',') {
        res.push(' ');
      } else {
        const remaining = digitsOnly.length - digitIdx - 1;
        res.push(10 ** remaining);
        digitIdx++;
      }
    }
    return res;
  })();

  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    gap,
    borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    color: textColor,
    fontWeight,
    direction: 'ltr',
    fontFamily: "'Space Grotesk', -apple-system, sans-serif"
  };

  const defaultTopGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`
  };

  const defaultBottomGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`
  };

  return (
    <span className="counter-container" style={containerStyle}>
      <span className="counter-counter" style={{ ...defaultCounterStyle, ...counterStyle }}>
        {computedPlaces.map((place, idx) => (
          <Digit key={`${place}-${idx}`} place={place} value={absVal} height={height} digitStyle={digitStyle} />
        ))}
      </span>
      {gradientHeight > 0 && (
        <span className="gradient-container">
          <span className="top-gradient" style={topGradientStyle || defaultTopGradientStyle}></span>
          <span className="bottom-gradient" style={bottomGradientStyle || defaultBottomGradientStyle}></span>
        </span>
      )}
    </span>
  );
}
