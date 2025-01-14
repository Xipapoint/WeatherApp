import React, { memo } from "react";

export type Props = React.ImgHTMLAttributes<HTMLImageElement>

const Image: React.FC<Props> = ({ src, alt, width, height, ...props }) => {
  return <img
  src={src}
  alt={alt}
  width={width}
  height={height}
  loading="lazy"
  {...props}
/>
};

export default memo(Image);
