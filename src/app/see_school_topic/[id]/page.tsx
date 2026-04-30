"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { firebaseConfig } from "../../firebaseconfig/firebase";
import { API_BASE_URL } from "../../api/api";
import { CachedImage, CachedPdfAnchor } from "../../../hooks/useCachedImage";
import { compressForUpload, prewarmImageCache } from "../../../lib/mediaCache";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const storage = getStorage(app);

type GroupContent = {
  id: number;
  user_id: number;
  school_id: number;
  group_id: number;
  group_contents_name: string;
  content: string;
  // API が storage_key から生成したフル URL
  image_urls?: string[];
  pdf_urls?: string[];
  // storage_key（プロバイダー非依存パス）— 編集時の再送信に使う
  image_keys?: string[];
  pdf_keys?: string[];
  created_at: string;
  updated_at: string;
};

type ApiResponse = {
  message: string;
  data: GroupContent;
  current_user?: { id: number };
  owner_name?: string;
  is_admin?: boolean;
};

// 画像: プレビュー用 URL + バックエンド送信用キー
type UploadedImage = {
  name: string;
  url: string;
  storageKey: string;
};

// PDF: ダウンロード用 URL + バックエンド送信用キー
type UploadedPdf = {
  url: string;
  key: string;
};

// storage_key の末尾からファイル名を取り出す（プロバイダー非依存）
function getFilenameFromKey(key: string, fallback: string): string {
  return key.split("/").pop() || fallback;
}

export default function SchoolsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contentId, setContentId] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [contentName, setContentName] = useState<string>("");
  const [markdown, setMarkdown] = useState<string>("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [pdfs, setPdfs] = useState<UploadedPdf[]>([]);
  const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const auth = getAuth(app);

  const getServerImageUrls = (data: GroupContent): string[] => data.image_urls ?? [];
  const getServerPdfUrls = (data: GroupContent): string[] => data.pdf_urls ?? [];
  const getServerImageKeys = (data: GroupContent): string[] => data.image_keys ?? [];
  const getServerPdfKeys = (data: GroupContent): string[] => data.pdf_keys ?? [];

  const fetchData = async (id: number, user: User) => {
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/see_groupcontent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ content: id }),
      });
      if (!res.ok) throw new Error("Fetch エラー");

      const data: ApiResponse = await res.json();
      setResponseData(data);
      setIsAdmin(data.is_admin === true);
    } catch (err: any) {
      console.error("Fetch エラー:", err.message);
      alert("データ取得に失敗しました");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!currentUser) return;

    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const parsedId = parseInt(lastPart, 10);

    if (!isNaN(parsedId)) {
      setContentId(parsedId);
      void fetchData(parsedId, currentUser);
    }
  }, [currentUser]);

  const handleImageDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    if (saving) return;
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    if (images.length >= 4) {
      alert("画像は最大4枚までです。");
      return;
    }

    const file = e.dataTransfer.files[0];
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("画像は5MB以下にしてください。");
      return;
    }

    try {
      setUploadingImage(true);
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      // Firebase 送信前に WebP 圧縮してデータ量を削減
      const compressed = await compressForUpload(file);
      await uploadBytes(storageRef, compressed, {
        contentType: "image/webp",
        cacheControl: "public, max-age=31536000, immutable",
      });
      // 同じ圧縮済み blob でキャッシュをプレウォーム（getDownloadURL 不要）
      const previewUrl = await prewarmImageCache(storageRef.fullPath, compressed);
      setImages((prev) => [...prev, { name: file.name, url: previewUrl, storageKey: storageRef.fullPath }]);
    } catch (err) {
      console.error("画像アップロードエラー:", err);
      alert("画像アップロードに失敗しました");
    } finally {
      setUploadingImage(false);
    }
  };

  // storageKey を受け取り、Firebase と API の両方から削除する
  const handleImageDelete = async (storageKey: string) => {
    try {
      await deleteObject(ref(storage, storageKey));
    } catch (err) {
      console.error("画像削除エラー:", err);
    }

    if (contentId && currentUser) {
      try {
        const idToken = await currentUser.getIdToken();
        await fetch(`${API_BASE_URL}/delete_image_url`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ content_id: contentId, storage_key: storageKey }),
        });
      } catch (err) {
        console.error("画像レコード削除エラー:", err);
      }
    }

    setImages((prev) => prev.filter((img) => img.storageKey !== storageKey));
  };

  const handlePdfUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("PDFファイルのみアップロード可能です。");
      return;
    }
    if (pdfs.length >= 2) {
      alert("PDFは最大2件までです。");
      return;
    }
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("PDFは10MB以下にしてください。");
      return;
    }

    try {
      setUploadingPdf(true);
      const storageRef = ref(storage, `pdfs/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file, {
        contentType: "application/pdf",
        cacheControl: "public, max-age=31536000, immutable",
      });
      const url = await getDownloadURL(storageRef);
      setPdfs((prev) => {
        const seen = new Set(prev.map((p) => p.key));
        if (seen.has(storageRef.fullPath)) return prev;
        return [...prev, { url, key: storageRef.fullPath }];
      });
      alert("PDFアップロード成功!");
    } catch (err) {
      console.error(err);
      alert("PDFアップロードに失敗しました");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handlePdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await handlePdfUpload(e.target.files[0]);
  };

  const handlePdfDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (saving) return;
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    await handlePdfUpload(e.dataTransfer.files[0]);
  };

  // storageKey を受け取り、Firebase と API の両方から削除する
  const handlePdfDelete = async (key: string) => {
    try {
      await deleteObject(ref(storage, key));
    } catch (err) {
      console.error("PDF削除エラー:", err);
    }

    if (contentId && currentUser) {
      try {
        const idToken = await currentUser.getIdToken();
        await fetch(`${API_BASE_URL}/delete_pdf_url`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ content_id: contentId, storage_key: key }),
        });
      } catch (err) {
        console.error("PDFレコード削除エラー:", err);
      }
    }

    setPdfs((prev) => prev.filter((p) => p.key !== key));
  };

  const enterEditMode = () => {
    if (!responseData) return;
    setContentName(responseData.data.group_contents_name ?? "");
    setMarkdown(responseData.data.content ?? "");

    // image_keys と image_urls を組み合わせて編集用ステートを構築
    const imageUrls = getServerImageUrls(responseData.data);
    const imageKeys = getServerImageKeys(responseData.data);
    setImages(
      imageKeys.map((key, i) => ({
        name: getFilenameFromKey(key, `image_${i + 1}`),
        url: imageUrls[i] ?? "",
        storageKey: key,
      }))
    );

    // pdf_keys と pdf_urls を組み合わせて編集用ステートを構築
    const pdfUrls = getServerPdfUrls(responseData.data);
    const pdfKeys = getServerPdfKeys(responseData.data);
    setPdfs(pdfKeys.map((key, i) => ({ url: pdfUrls[i] ?? "", key })));

    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (!responseData) return;
    setContentName(responseData.data.group_contents_name ?? "");
    setMarkdown(responseData.data.content ?? "");

    const imageUrls = getServerImageUrls(responseData.data);
    const imageKeys = getServerImageKeys(responseData.data);
    setImages(
      imageKeys.map((key, i) => ({
        name: getFilenameFromKey(key, `image_${i + 1}`),
        url: imageUrls[i] ?? "",
        storageKey: key,
      }))
    );

    const pdfUrls = getServerPdfUrls(responseData.data);
    const pdfKeys = getServerPdfKeys(responseData.data);
    setPdfs(pdfKeys.map((key, i) => ({ url: pdfUrls[i] ?? "", key })));
  };

  const handleSave = async () => {
    if (!contentId || !currentUser) return;
    setSaving(true);

    try {
      const idToken = await currentUser.getIdToken();
      const body = {
        id: contentId,
        group_contents_name: contentName,
        content: markdown,
        // storage_key のみ送信。バックエンドがプロバイダーに応じた URL を生成する。
        image_keys: [...new Set(images.map((img) => img.storageKey))],
        pdf_keys: [...new Set(pdfs.map((p) => p.key))],
      };

      const res = await fetch(`${API_BASE_URL}/editSchoolContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("更新に失敗しました");

      if (currentUser) {
        await fetchData(contentId, currentUser);
      }
      setIsEditing(false);
      alert("コンテンツを更新しました");
    } catch (err) {
      console.error(err);
      alert("更新に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!contentId || !currentUser || !responseData) return;
    if (!confirm("本当にこのグループコンテンツを削除しますか?")) return;

    try {
      const idToken = await currentUser.getIdToken();

      // DB を先に削除し、成功後に Storage を削除する（順序逆だと不整合が残る）
      const res = await fetch(`${API_BASE_URL}/group_contents/${contentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error("グループコンテンツ削除に失敗しました");

      const allKeys = [
        ...getServerImageKeys(responseData.data),
        ...getServerPdfKeys(responseData.data),
      ];
      for (const key of allKeys) {
        try {
          await deleteObject(ref(storage, key));
        } catch (err) {
          console.error("ストレージ削除失敗:", err);
        }
      }

      alert("グループコンテンツを削除しました");
      window.location.href = "/schools";
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました");
    }
  };

  if (!responseData) {
    return <p className="text-center p-6 text-gray-600">データを取得中...</p>;
  }

  const displayImageUrls = getServerImageUrls(responseData.data);
  const displayImageKeys = getServerImageKeys(responseData.data);
  const displayPdfUrls = getServerPdfUrls(responseData.data);
  const displayPdfKeys = getServerPdfKeys(responseData.data);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex flex-col items-center font-sans">
      {saving && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl px-8 py-6 shadow-2xl text-blue-800 font-semibold text-lg">
            保存中...
          </div>
        </div>
      )}
      <div className={`w-full bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 ${isEditing ? "max-w-6xl" : "max-w-4xl"}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <a
              href="/schools"
              className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              ← 学校一覧に戻る
            </a>
            <h2 className="text-2xl font-bold text-blue-800">
              {isEditing ? "コンテンツを編集" : "スクールトピック詳細"}
            </h2>
          </div>
          {(isAdmin || responseData.current_user?.id === responseData.data.user_id) && !isEditing && (
            <div>
              <button
                onClick={enterEditMode}
                className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition text-sm font-semibold shadow"
              >
                編集
              </button>
              <button
                onClick={handleDelete}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm font-semibold shadow"
              >
                削除
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-6">
              <div>
                <h3 className="text-blue-700 font-semibold mb-2">コンテンツ名</h3>
                <input
                  type="text"
                  value={contentName}
                  onChange={(e) => setContentName(e.target.value.slice(0, 50))}
                  disabled={saving}
                  maxLength={50}
                  className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                  placeholder="コンテンツ名"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${contentName.length >= 50 ? "text-red-500 font-semibold" : contentName.length >= 40 ? "text-yellow-500" : "text-gray-400"}`}>
                    {contentName.length}/50
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="text-blue-700 font-semibold mb-2">本文 (Markdown)</h3>
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value.slice(0, 5000))}
                  onDrop={handleImageDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  placeholder="ここにテキストを書いてください"
                  disabled={saving}
                  maxLength={5000}
                  className="w-full flex-1 min-h-[300px] p-3 border border-blue-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${markdown.length >= 5000 ? "text-red-500 font-semibold" : markdown.length >= 4500 ? "text-yellow-500" : "text-gray-400"}`}>
                    {markdown.length}/5000
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-blue-800 font-semibold mb-2">画像</h3>
                {images.length > 0 && (
                  <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {images.map((img) => (
                      <div key={img.storageKey} className="flex items-center gap-2 p-2 border rounded bg-blue-50">
                        <CachedImage src={img.url} storageKey={img.storageKey} alt={img.name} className="w-12 h-12 object-cover rounded" loading="lazy" decoding="async" />
                        <span className="flex-1 text-sm truncate">{img.name}</span>
                        <button
                          onClick={() => handleImageDelete(img.storageKey)}
                          disabled={saving}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          削除
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-blue-700">画像を表示します</p>
              </div>

              <div>
                <h3 className="text-blue-800 font-semibold mb-2">PDF添付</h3>
                <div
                  onDrop={handlePdfDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="p-6 text-center border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
                >
                  <p className="text-blue-700 mb-3">PDFファイルをドラッグ＆ドロップ</p>
                  <label className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition">
                    {uploadingPdf ? "アップロード中..." : "ファイル選択"}
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: "none" }}
                      onChange={handlePdfSelect}
                      disabled={uploadingPdf || saving}
                    />
                  </label>
                </div>

                {pdfs.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {pdfs.map((pdf) => (
                      <div key={pdf.key} className="flex items-center justify-between gap-2 p-2 border rounded bg-blue-50">
                        <a
                          href={pdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 underline truncate"
                        >
                          {getFilenameFromKey(pdf.key, "PDFファイル")}
                        </a>
                        <button
                          onClick={() => handlePdfDelete(pdf.key)}
                          disabled={saving}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          削除
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving || uploadingImage || uploadingPdf || contentName.length > 50 || markdown.length > 5000}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "保存中..." : uploadingImage ? "画像アップロード中..." : uploadingPdf ? "PDFアップロード中..." : "更新を保存"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  キャンセル
                </button>
              </div>
            </div>

            <div className="flex flex-col h-full max-h-[800px]">
              <h3 className="text-blue-800 font-semibold mb-2">プレビュー</h3>
              <div className="flex-1 border border-blue-200 p-6 rounded-lg bg-blue-50 overflow-y-auto prose max-w-none prose-headings:text-blue-900 prose-a:text-blue-600 prose-code:before:content-none prose-code:after:content-none shadow-inner">
                {markdown ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                      p: ({ node, ...props }) => <p {...props} style={{ marginBottom: "1.1rem", lineHeight: 1.8 }} />,
                      a: ({ node, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" />
                      ),
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                ) : (
                  <p className="not-prose text-gray-400 text-sm">プレビューがここに表示されます...</p>
                )}

                {images.length > 0 && (
                  <div className="not-prose mb-6">
                    <h4 className="text-blue-800 font-semibold mb-2">画像プレビュー</h4>
                    <div className="space-y-2">
                      {images.map((img) => (
                        <CachedImage
                          key={img.storageKey}
                          src={img.url}
                          storageKey={img.storageKey}
                          alt={img.name}
                          className="w-full h-auto rounded border border-blue-200 block"
                          loading="lazy"
                          decoding="async"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-b-2 border-blue-200 pb-3">
              <h3 className="text-2xl font-bold text-blue-900">{responseData.data.group_contents_name}</h3>
              <p className="mt-2 text-sm text-blue-700">
                作成者:{" "}
                <a
                  href={`/user_profile/${responseData.data.user_id}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {responseData.owner_name ?? `ID:${responseData.data.user_id}`}
                </a>
              </p>
            </div>

            {displayPdfUrls.length > 0 && (
              <div className="space-y-2">
                {displayPdfUrls.map((url, idx) => (
                  <div key={displayPdfKeys[idx] ?? url} className="flex items-center justify-between gap-4 p-4 border border-blue-300 bg-blue-50 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-2xl">📄</span>
                      <span className="font-semibold text-blue-800 truncate">
                        {getFilenameFromKey(displayPdfKeys[idx] ?? "", `pdf_${idx + 1}`)}
                      </span>
                    </div>
                    <CachedPdfAnchor
                      storageKey={displayPdfKeys[idx] ?? url}
                      url={url}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition"
                    >
                      ダウンロード
                    </CachedPdfAnchor>
                  </div>
                ))}
              </div>
            )}

            {displayImageUrls.length > 0 && (
              <div className="space-y-3">
                {displayImageUrls.map((url, idx) => (
                  <CachedImage
                    key={url}
                    src={url}
                    storageKey={displayImageKeys[idx]}
                    alt={`image_${idx + 1}`}
                    className="w-full h-auto rounded border border-blue-200 block"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            )}

            <div className="border border-blue-200 p-6 rounded-lg bg-blue-50 prose max-w-none prose-headings:text-blue-900 prose-a:text-blue-600 prose-code:before:content-none prose-code:after:content-none shadow-sm min-h-[260px]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  p: ({ node, ...props }) => <p {...props} style={{ marginBottom: "1.1rem", lineHeight: 1.8 }} />,
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {responseData.data.content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
