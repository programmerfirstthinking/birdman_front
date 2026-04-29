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
import { CachedImage } from "../../../hooks/useCachedImage";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const storage = getStorage(app);

type GroupContent = {
  id: number;
  user_id: number;
  school_id: number;
  group_id: number;
  group_contents_name: string;
  content: string;
  pdf_url?: string;
  pdf_urls?: string[];
  image_urls?: string[];
  created_at: string;
  updated_at: string;
};

type ApiResponse = {
  message: string;
  data: GroupContent;
  current_user?: { id: number };
  owner_name?: string;
};

type UploadedImage = {
  name: string;
  url: string;
};

function getFilenameFromUrl(url: string, fallbackPrefix: string): string {
  try {
    if (url.includes("/o/")) {
      const path = decodeURIComponent(url.split("/o/")[1].split("?")[0]);
      const name = path.split("/").pop();
      return name || `${fallbackPrefix}_file`;
    }
    const withoutQuery = url.split("?")[0];
    const name = withoutQuery.split("/").pop();
    return name || `${fallbackPrefix}_file`;
  } catch {
    return `${fallbackPrefix}_file`;
  }
}

function uniqueUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of urls) {
    const u = raw.trim();
    if (!u || seen.has(u)) {
      continue;
    }
    seen.add(u);
    result.push(u);
  }
  return result;
}

export default function SchoolsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contentId, setContentId] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [contentName, setContentName] = useState<string>("");
  const [markdown, setMarkdown] = useState<string>("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);

  const auth = getAuth(app);

  const getServerImageUrls = (data: GroupContent): string[] => data.image_urls ?? [];
  const getServerPdfUrls = (data: GroupContent): string[] => {
    if (data.pdf_urls && data.pdf_urls.length > 0) {
      return data.pdf_urls;
    }
    return data.pdf_url ? [data.pdf_url] : [];
  };

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
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const file = e.dataTransfer.files[0];
    const MAX_SIZE = 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("画像は1MB以下にしてください。");
      return;
    }

    try {
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file, {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
      });
      const url = await getDownloadURL(storageRef);
      setImages((prev) => [...prev, { name: file.name, url }]);
    } catch (err) {
      console.error("画像アップロードエラー:", err);
      alert("画像アップロードに失敗しました");
    }
  };

  const handleImageDelete = async (url: string) => {
    try {
      if (url.includes("/o/")) {
        const path = decodeURIComponent(url.split("/o/")[1].split("?")[0]);
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
      }
    } catch (err) {
      console.error("画像削除エラー:", err);
    }

    // DB からも即削除
    if (contentId && currentUser) {
      try {
        const idToken = await currentUser.getIdToken();
        await fetch(`${API_BASE_URL}/delete_image_url`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ content_id: contentId, image_url: url }),
        });
      } catch (err) {
        console.error("画像レコード削除エラー:", err);
      }
    }

    setImages((prev) => prev.filter((img) => img.url !== url));
  };

  const handlePdfUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("PDFファイルのみアップロード可能です。");
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
      setPdfUrls((prev) => uniqueUrls([...prev, url]));
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
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    await handlePdfUpload(e.dataTransfer.files[0]);
  };

  const handlePdfDelete = async (url: string) => {
    try {
      if (url.includes("/o/")) {
        const path = decodeURIComponent(url.split("/o/")[1].split("?")[0]);
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
      }
    } catch (err) {
      console.error("PDF削除エラー:", err);
    }

    // DB からも即削除
    if (contentId && currentUser) {
      try {
        const idToken = await currentUser.getIdToken();
        await fetch(`${API_BASE_URL}/delete_pdf_url`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ content_id: contentId, pdf_url: url }),
        });
      } catch (err) {
        console.error("PDFレコード削除エラー:", err);
      }
    }

    setPdfUrls((prev) => prev.filter((u) => u !== url));
  };

  const enterEditMode = () => {
    if (!responseData) return;
    setContentName(responseData.data.group_contents_name ?? "");
    setMarkdown(responseData.data.content ?? "");

    const imageState = getServerImageUrls(responseData.data).map((url, idx) => ({
      url,
      name: getFilenameFromUrl(url, `image_${idx + 1}`),
    }));
    const pdfState = getServerPdfUrls(responseData.data);

    setImages(imageState);
    setPdfUrls(pdfState);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (!responseData) return;
    setContentName(responseData.data.group_contents_name ?? "");
    setMarkdown(responseData.data.content ?? "");
    setImages(
      getServerImageUrls(responseData.data).map((url, idx) => ({
        url,
        name: getFilenameFromUrl(url, `image_${idx + 1}`),
      })),
    );
    setPdfUrls(getServerPdfUrls(responseData.data));
  };

  const handleSave = async () => {
    if (!contentId || !currentUser) return;

    try {
      const idToken = await currentUser.getIdToken();
      const body = {
        id: contentId,
        group_contents_name: contentName,
        content: markdown,
        image_urls: uniqueUrls(images.map((img) => img.url)),
        pdf_urls: uniqueUrls(pdfUrls),
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
    }
  };

  const handleDelete = async () => {
    if (!contentId || !currentUser || !responseData) return;
    if (!confirm("本当にこのグループコンテンツを削除しますか?")) return;

    try {
      const idToken = await currentUser.getIdToken();

      const allImageUrls = getServerImageUrls(responseData.data);
      const allPdfUrls = getServerPdfUrls(responseData.data);

      for (const url of [...allImageUrls, ...allPdfUrls]) {
        try {
          if (url.includes("/o/")) {
            const path = decodeURIComponent(url.split("/o/")[1].split("?")[0]);
            await deleteObject(ref(storage, path));
          }
        } catch (err) {
          console.error("ストレージ削除失敗:", err);
        }
      }

      const res = await fetch(`${API_BASE_URL}/group_contents/${contentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error("グループコンテンツ削除に失敗しました");

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
  const displayPdfUrls = getServerPdfUrls(responseData.data);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex flex-col items-center font-sans">
      <div className={`w-full bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 ${isEditing ? "max-w-6xl" : "max-w-4xl"}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <a
              href="/schools"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← ホーム
            </a>
            <h2 className="text-2xl font-bold text-blue-800">
              {isEditing ? "コンテンツを編集" : "スクールトピック詳細"}
            </h2>
          </div>
          {responseData.current_user?.id === responseData.data.user_id && !isEditing && (
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
                  onChange={(e) => setContentName(e.target.value)}
                  className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="コンテンツ名"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="text-blue-700 font-semibold mb-2">本文 (Markdown)</h3>
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  onDrop={handleImageDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  placeholder="ここにテキストを書いてください"
                  className="w-full flex-1 min-h-[300px] p-3 border border-blue-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <h3 className="text-blue-800 font-semibold mb-2">画像 (本文とは別保存)</h3>
                {images.length > 0 && (
                  <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {images.map((img) => (
                      <div key={img.url} className="flex items-center gap-2 p-2 border rounded bg-blue-50">
                        <CachedImage src={img.url} alt={img.name} className="w-12 h-12 object-cover rounded" loading="lazy" decoding="async" />
                        <span className="flex-1 text-sm truncate">{img.name}</span>
                        <button
                          onClick={() => handleImageDelete(img.url)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                        >
                          削除
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-blue-700">本文欄に画像をドラッグ＆ドロップすると、画像は別テーブル保存されます。</p>
              </div>

              <div>
                <h3 className="text-blue-800 font-semibold mb-2">PDF添付 (本文とは別保存)</h3>
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
                      disabled={uploadingPdf}
                    />
                  </label>
                </div>

                {pdfUrls.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {pdfUrls.map((url, idx) => (
                      <div key={url} className="flex items-center justify-between gap-2 p-2 border rounded bg-blue-50">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 underline truncate"
                        >
                          {getFilenameFromUrl(url, `pdf_${idx + 1}`)}
                        </a>
                        <button
                          onClick={() => handlePdfDelete(url)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
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
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition"
                >
                  更新を保存
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg shadow transition"
                >
                  キャンセル
                </button>
              </div>
            </div>

            <div className="flex flex-col h-full max-h-[800px]">
              <h3 className="text-blue-800 font-semibold mb-2">プレビュー</h3>
              <div className="flex-1 border border-blue-200 p-6 rounded-lg bg-blue-50 overflow-y-auto prose max-w-none shadow-inner">
                {markdown ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                      p: ({ node, ...props }) => <p {...props} style={{ marginBottom: "1.1rem", lineHeight: 1.8 }} />,
                      br: ({ node, ...props }) => <br {...props} style={{ display: "block", marginBottom: "0.9em", lineHeight: 1.8 }} />,
                      a: ({ node, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />
                      ),
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-400 text-sm">プレビューがここに表示されます...</p>
                )}

                {images.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-blue-800 font-semibold mb-2">画像プレビュー</h4>
                    <div className="space-y-2">
                      {images.map((img) => (
                        <CachedImage
                          key={img.url}
                          src={img.url}
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
                  <div key={url} className="flex items-center justify-between gap-4 p-4 border border-blue-300 bg-blue-50 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-2xl">📄</span>
                      <span className="font-semibold text-blue-800 truncate">
                        {getFilenameFromUrl(url, `pdf_${idx + 1}`)}
                      </span>
                    </div>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition"
                    >
                      ダウンロード
                    </a>
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
                    alt={getFilenameFromUrl(url, `image_${idx + 1}`)}
                    className="w-full h-auto rounded border border-blue-200 block"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            )}

            <div className="border border-blue-200 p-6 rounded-lg bg-blue-50 prose max-w-none shadow-sm min-h-[260px]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  p: ({ node, ...props }) => <p {...props} style={{ marginBottom: "1.1rem", lineHeight: 1.8 }} />,
                  br: ({ node, ...props }) => <br {...props} style={{ display: "block", marginBottom: "0.9em", lineHeight: 1.8 }} />,
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold" />
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
