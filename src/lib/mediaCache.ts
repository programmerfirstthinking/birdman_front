// IndexedDB を使ってメディアファイルをブラウザに永続キャッシュする。
// Cache API より消去されにくく、任意のキーで管理できる。
// storage_key を安定したキャッシュキーとして使うため、
// Firebase のダウンロードトークンが変わっても同じキャッシュにヒットする。

const DB_NAME = "birdman-media-db";
const DB_VERSION = 1;
const STORE_NAME = "media";

// ─── IndexedDB 接続 ───────────────────────────────────────────────────────────

let _db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db);

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    req.onsuccess = () => {
      _db = req.result;
      _db.onclose = () => { _db = null; };
      resolve(_db);
    };

    req.onerror = () => reject(req.error);
  });
}

async function getBlob(key: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_NAME, "readonly")
      .objectStore(STORE_NAME)
      .get(key);
    req.onsuccess = () => resolve((req.result as Blob) ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function putBlob(key: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

// ─── 画像圧縮 ────────────────────────────────────────────────────────────────

async function compressImageBlob(blob: Blob, maxWidth = 1200, quality = 0.82): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const scale = Math.min(1, maxWidth / img.naturalWidth);
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(blob); return; }
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (compressed) => {
          // 圧縮後のほうが大きければ元を使う
          if (compressed && compressed.size < blob.size) resolve(compressed);
          else resolve(blob);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(blob); };
    img.src = objectUrl;
  });
}

// ─── キャッシュキー ───────────────────────────────────────────────────────────

// storageKey (例: "images/12345_foo.png") → IndexedDB のキー
function toDBKey(storageKey: string): string {
  return `media:${storageKey}`;
}

// ─── アップロード前圧縮（Firebase 送信用）────────────────────────────────────

/**
 * Firebase Storage に送る前に画像を圧縮する。
 * キャッシュには関係なく、送信データ量だけを削減したいときに使う。
 */
export async function compressForUpload(file: File): Promise<Blob> {
  return compressImageBlob(file, 1600, 0.85);
}

// ─── 画像キャッシュ ───────────────────────────────────────────────────────────

/**
 * storageKey をキーとして IndexedDB から画像 blob を取得し blob URL を返す。
 * キャッシュヒット時は Firebase に一切アクセスしない。
 * キャッシュミス時は remoteUrl から取得し WebP 圧縮して保存する。
 */
export async function getCachedImageUrl(storageKey: string, remoteUrl: string): Promise<string> {
  if (typeof window === "undefined" || !window.indexedDB) return remoteUrl;

  const key = toDBKey(storageKey);

  try {
    const cached = await getBlob(key);
    if (cached) return URL.createObjectURL(cached);

    const res = await fetch(remoteUrl);
    if (!res.ok) return remoteUrl;

    const blob = await res.blob();
    const compressed = await compressImageBlob(blob);
    await putBlob(key, compressed);
    return URL.createObjectURL(compressed);
  } catch {
    return remoteUrl;
  }
}

/**
 * アップロード直後にローカルの File/Blob を IndexedDB にキャッシュする（プレウォーム）。
 * Firebase から再ダウンロードせずにプレビューを表示でき、
 * see_school_topic で同じ画像を開く際の Firebase 通信もゼロにする。
 */
export async function prewarmImageCache(storageKey: string, source: Blob): Promise<string> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return URL.createObjectURL(source);
  }

  const key = toDBKey(storageKey);

  try {
    const cached = await getBlob(key);
    if (cached) return URL.createObjectURL(cached);

    const compressed = await compressImageBlob(source);
    await putBlob(key, compressed);
    return URL.createObjectURL(compressed);
  } catch {
    return URL.createObjectURL(source);
  }
}

// ─── PDF キャッシュ ───────────────────────────────────────────────────────────

/**
 * storageKey をキーとして IndexedDB から PDF blob を取得し blob URL を返す。
 * キャッシュヒット時は Firebase に一切アクセスしない。
 * PDF は圧縮しない（圧縮すると壊れる）。
 */
export async function getCachedPdfUrl(storageKey: string, remoteUrl: string): Promise<string> {
  if (typeof window === "undefined" || !window.indexedDB) return remoteUrl;

  const key = toDBKey(storageKey);

  try {
    const cached = await getBlob(key);
    if (cached) return URL.createObjectURL(cached);

    const res = await fetch(remoteUrl);
    if (!res.ok) return remoteUrl;

    const blob = await res.blob();
    await putBlob(key, blob);
    return URL.createObjectURL(blob);
  } catch {
    return remoteUrl;
  }
}
