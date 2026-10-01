import React, { useEffect, useState } from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Material Symbols glyph drawn when the remote image cannot be loaded. */
  fallbackIcon?: string;
}

/**
 * Product renders are hosted on a remote CDN whose links can expire. When one
 * fails we swap in a branded glyph instead of the browser's broken-image icon,
 * so the storefront still reads correctly.
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  fallbackIcon = 'water_drop',
  className = '',
  ...rest
}) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // A new src deserves a fresh attempt.
  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  if (failed) {
    return (
      <span
        role={alt ? 'img' : 'presentation'}
        aria-label={alt || undefined}
        // `cqmin` scales the glyph to the box the image would have filled,
        // which ranges from a 36px toast thumb to a 288px hero render.
        style={{ containerType: 'size' }}
        className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary-fixed/70 to-secondary-fixed/50 text-primary/70 ${className}`}
      >
        <span
          className="material-symbols-outlined leading-none"
          style={{ fontSize: 'max(14px, 52cqmin)' }}
        >
          {fallbackIcon}
        </span>
      </span>
    );
  }

  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      loading={rest.loading ?? 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};
