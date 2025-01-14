import React, { memo, useMemo } from "react";

import styles from './userInfo.module.scss'

// const createFontWeights = <K extends NonNullable<React.CSSProperties["fontWeight"]>>(
//   r: Record<K, NonNullable<React.CSSProperties["fontFamily"]>>,
// ) => r;

export const fontWeights = {
  "400": "400",
  "600": "600",
}

type FontWeight = keyof typeof fontWeights;

interface Typography {
  fontSize: number;
  fontWeight: FontWeight;
}

const createVariants = <K extends string>(r: Record<K, Typography>) => r;

export const variants = createVariants({
  modal: { fontSize: 12,  fontWeight: "400" },
  default: {fontSize: 17, fontWeight: "600"}
});

export type Variant = keyof typeof variants;

export const getVariantStyle = (
  variant: Variant,
): React.CSSProperties => {
  const { fontSize, fontWeight } = variants[variant];

  return {
    fontSize,
    fontFamily: fontWeights[fontWeight],
  };
};


export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  first: string;
  last: string;
  country: string;
  city: string;
  variant?: Variant
}


const UserInfo: React.FC<Props> = ({
    className = '',
    title,
    first,
    last,
    country,
    city,
    variant = "default",
    ...props
  }) => {
    const textStyle = useMemo(
      () => getVariantStyle(variant),
      [variant],
    );
    return (
      <div className={`${styles.userInfo} ${className}`} style={textStyle} {...props}>
        <p>{`${title}. ${first} ${last}`}</p>
        <p>{`${country}, ${city}`}</p>
      </div>
    );
  };

export default memo(UserInfo);
