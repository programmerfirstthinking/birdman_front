"use client";

import React from "react";

type CachedImageProps = {
  src: string | null;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync";
  style?: React.CSSProperties;
  onClick?: () => void;
};

// キャッシュされた画像を表示するコンポーネント
// Firebase Storage は cacheControl: "public, max-age=31536000, immutable" でアップロードしているため
// ブラウザが自動的にキャッシュする → 2回目以降は通信なしで即表示
export const CachedImage: React.FC<CachedImageProps> = ({
  src,
  alt,
  className = "",
  loading = "lazy",
  decoding = "async",
  style,
  onClick,
}) => {
  if (!src) {
    return <div className={`bg-gray-200 ${className}`} style={style} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      style={style}
      onClick={onClick}
    />
  );
};