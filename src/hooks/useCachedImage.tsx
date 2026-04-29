"use client";

import React, { useEffect, useRef, useState } from "react";
import { getCachedImageUrl, getCachedPdfUrl } from "../lib/mediaCache";

// ─── CachedImage ─────────────────────────────────────────────────────────────

type CachedImageProps = {
  src: string | null;
  /** Cache API のキー。storageKey を渡すとトークン変更後も同一キャッシュにヒットする */
  storageKey?: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync";
  style?: React.CSSProperties;
  onClick?: () => void;
};

/**
 * 画像を Cache API に圧縮保存し、2回目以降は Firebase 通信なしで表示する。
 */
export const CachedImage: React.FC<CachedImageProps> = ({
  src,
  storageKey,
  alt,
  className = "",
  loading = "lazy",
  decoding = "async",
  style,
  onClick,
}) => {
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!src) { setDisplaySrc(null); return; }

    const cacheKey = storageKey ?? src;
    let cancelled = false;

    getCachedImageUrl(cacheKey, src).then((url) => {
      if (cancelled) {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
        return;
      }
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = url.startsWith("blob:") ? url : null;
      setDisplaySrc(url);
    });

    return () => { cancelled = true; };
  }, [src, storageKey]);

  // アンマウント時に blob URL を解放
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  if (!displaySrc) {
    return <div className={`bg-gray-200 animate-pulse ${className}`} style={style} />;
  }

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      style={style}
      onClick={onClick}
    />
  );
};

// ─── CachedPdfAnchor ─────────────────────────────────────────────────────────

type CachedPdfAnchorProps = {
  storageKey: string;
  url: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * PDF を Cache API に保存し、2回目以降は Firebase 通信なしでダウンロード/表示できる。
 */
export const CachedPdfAnchor: React.FC<CachedPdfAnchorProps> = ({
  storageKey,
  url,
  className,
  children,
}) => {
  const [cachedUrl, setCachedUrl] = useState<string>(url);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getCachedPdfUrl(storageKey, url).then((resolved) => {
      if (cancelled) {
        if (resolved.startsWith("blob:")) URL.revokeObjectURL(resolved);
        return;
      }
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = resolved.startsWith("blob:") ? resolved : null;
      setCachedUrl(resolved);
    });

    return () => { cancelled = true; };
  }, [storageKey, url]);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  return (
    <a href={cachedUrl} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
};
