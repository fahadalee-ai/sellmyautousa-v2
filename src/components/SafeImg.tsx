import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { FALLBACK_IMAGE } from "@/lib/images";

export function SafeImg({
  src,
  fallback = FALLBACK_IMAGE,
  alt = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { fallback?: string }) {
  const [current, setCurrent] = useState(src || fallback);

  useEffect(() => {
    setCurrent(src || fallback);
  }, [src, fallback]);

  return (
    <img
      {...props}
      alt={alt}
      src={current}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
