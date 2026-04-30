"use client";

// import React, { useState, useEffect } from "react";
import React, { useState, useEffect, useRef } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { firebaseConfig } from "../../firebaseconfig/firebase";
import { API_BASE_URL } from "../../api/api";
import { useRouter, useSearchParams } from "next/navigation";
import { prewarmImageCache, compressForUpload } from "../../../lib/mediaCache";
import { MarkdownToolbar } from "../../../components/MarkdownToolbar";

// 🔥 Firebase 初期化（重複を避ける）
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);

const MarkdownImageUploader: React.FC = () => {

  const router = useRouter();
  const searchParams = useSearchParams();

  type UploadedImage = {
    name: string;
    url: string;        // プレビュー用（クライアントのみ）
    storageKey: string; // DB 保存用（プロバイダー非依存パス）
  };

  type UploadedPdf = { url: string; key: string };

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [markdown, setMarkdown] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sending, setSending] = useState<boolean>(false);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [contentName, setContentName] = useState<string>("");
  const [pdfs, setPdfs] = useState<UploadedPdf[]>([]);
  const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const MAX_IMAGES = 4;
  const MAX_PDFS = 2;

  // URLから groupId を取得
  useEffect(() => {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const parsedId = parseInt(lastPart, 10);
    if (!isNaN(parsedId)) setGroupId(parsedId);
  }, []);

  const handleImageUpload = async (file: File) => {
    if (images.length >= MAX_IMAGES) {
      alert(`画像は最大${MAX_IMAGES}枚までです。`);
      return;
    }
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("画像は5MB以下にしてください。");
      return;
    }

    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);

    try {
      setUploadingImage(true);
      const compressed = await compressForUpload(file);
      await uploadBytes(storageRef, compressed, {
        contentType: "image/webp",
        cacheControl: "public, max-age=31536000, immutable",
      });
      const previewUrl = await prewarmImageCache(storageRef.fullPath, compressed);
      setImages((prev) => [...prev, { name: file.name, url: previewUrl, storageKey: storageRef.fullPath }]);
    } catch (err) {
      console.error("画像アップロードエラー:", err);
      alert("アップロードに失敗しました。");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async (image: UploadedImage) => {
    try {
      // storageKey を使って直接 Firebase 参照を作成（URL パース不要）
      await deleteObject(ref(storage, image.storageKey));
      setImages((prev) => prev.filter((img) => img.storageKey !== image.storageKey));
    } catch (err) {
      console.error("画像削除エラー:", err);
      alert("画像の削除に失敗しました");
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    if (sending) return;
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const file = e.dataTransfer.files[0];
    await handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePdfUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("PDFファイルのみアップロード可能です。");
      return;
    }
    if (pdfs.length >= MAX_PDFS) {
      alert(`PDFは最大${MAX_PDFS}件までです。`);
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
      setPdfs((prev) => [...prev, { url, key: storageRef.fullPath }]);
      alert("PDFアップロード成功！");
    } catch (err) {
      console.error(err);
      alert("PDFアップロードに失敗しました");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handlePdfDelete = async (key: string) => {
    try {
      await deleteObject(ref(storage, key));
      setPdfs((prev) => prev.filter((p) => p.key !== key));
    } catch (err) {
      console.error(err);
      alert("PDFの削除に失敗しました");
    }
  };

  const handlePdfDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (sending) return;
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const file = e.dataTransfer.files[0];
    await handlePdfUpload(file);
  };

  const handlePdfDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    await handlePdfUpload(file);
  };

  const handleSend = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("ログインが必要です");
      return;
    }
    if (!groupId) {
      alert("groupId が取得できませんでした");
      return;
    }
    if (!contentName.trim()) {
      alert("コンテンツ名を入力してください");
      return;
    }

    setSending(true);

    try {
      const idToken = await user.getIdToken();
      // imageKeys / pdfKeys としてストレージパスのみを送信。
      // バックエンドがプロバイダーに応じたフル URL を生成する。
      const payload = {
        groupId,
        contentName,
        content: markdown,
        imageKeys: images.map((img) => img.storageKey),
        pdfKeys: pdfs.map((p) => p.key),
      };

      const response = await fetch(`${API_BASE_URL}/make_grouptopic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`送信に失敗: ${response.status}`);

      alert("送信成功！");
      setImages([]);
      setMarkdown("");
      setContentName("");
      setPdfs([]);
      const schoolIdParam = searchParams.get("schoolId");
      const schoolId = schoolIdParam ? Number(schoolIdParam) : NaN;
      if (!Number.isNaN(schoolId)) {
        router.push(`/school_topic/${schoolId}`);
      } else {
        router.push("/schools");
      }
    } catch (err) {
      console.error(err);
      alert("送信中にエラーが発生しました");
    } finally {
      setSending(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex flex-col items-center font-sans">
    {sending && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl px-8 py-6 shadow-2xl text-blue-800 font-semibold text-lg">
          送信中...
        </div>
      </div>
    )}
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6">

      <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
        入力（左）＋ プレビュー（右）
      </h2>

      {/* 2カラムレイアウト */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* =========================
            左：編集エリア
        ========================= */}
        <div className="flex flex-col">

          <div className="mb-4">
            <input
              type="text"
              placeholder="コンテンツ名"
              value={contentName}
              onChange={(e) => setContentName(e.target.value.slice(0, 50))}
              disabled={sending}
              maxLength={50}
              className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            />
            <div className="text-right mt-1">
              <span className={`text-xs ${contentName.length >= 50 ? "text-red-500 font-semibold" : contentName.length >= 40 ? "text-yellow-500" : "text-gray-400"}`}>
                {contentName.length}/50
              </span>
            </div>
          </div>

          <div className="mb-4">
            <MarkdownToolbar
              textareaRef={textareaRef}
              value={markdown}
              onChange={(v) => setMarkdown(v.slice(0, 5000))}
              disabled={sending}
            />
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value.slice(0, 5000))}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              placeholder="ここに記事を書いてください"
              disabled={sending}
              maxLength={5000}
              className="w-full h-64 p-3 border border-blue-300 border-t-0 rounded-b-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            />
            <div className="text-right mt-1">
              <span className={`text-xs ${markdown.length >= 5000 ? "text-red-500 font-semibold" : markdown.length >= 4500 ? "text-yellow-500" : "text-gray-400"}`}>
                {markdown.length}/5000
              </span>
            </div>
          </div>

          {/* 送信ボタン */}
          <button
            onClick={handleSend}
            disabled={sending || uploadingImage || uploadingPdf || !groupId || !contentName.trim() || !markdown.trim() || contentName.length > 50 || markdown.length > 5000}
            className={`mb-6 px-6 py-3 rounded-lg text-white font-semibold transition ${
              sending || uploadingImage || uploadingPdf || !groupId || !contentName.trim() || !markdown.trim() || contentName.length > 50 || markdown.length > 5000
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {sending ? "送信中..." : uploadingImage ? "画像アップロード中..." : uploadingPdf ? "PDFアップロード中..." : "送信"}
          </button>

          {/* 画像プレビュー */}
          {images.length > 0 && (
            <div className="mb-4">
              <h3 className="text-blue-800 font-semibold mb-2">画像</h3>
              {images.map((img) => (
                <div
                  key={img.storageKey}
                  className="flex items-center gap-2 mb-2 border p-2 rounded bg-blue-50"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span className="flex-1 text-sm">{img.name}</span>
                  <button
                    onClick={() => handleImageDelete(img)}
                    disabled={sending}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* PDFアップロード */}
          <div
            onDrop={handlePdfDrop}
            onDragOver={handlePdfDragOver}
            className="p-4 text-center border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
          >
            <p className="text-blue-700 mb-1">📄 PDFアップロード</p>
            <p className="text-xs text-blue-500 mb-2">{pdfs.length}/{MAX_PDFS}件</p>

            <label className={`inline-block text-white px-4 py-2 rounded-lg transition ${pdfs.length >= MAX_PDFS || sending ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 cursor-pointer hover:bg-blue-700"}`}>
              ファイル選択
              <input
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={handlePdfSelect}
                disabled={sending || pdfs.length >= MAX_PDFS}
              />
            </label>

            {pdfs.length > 0 && (
              <div className="mt-3 space-y-2">
                {pdfs.map((pdf) => (
                  <div key={pdf.key} className="flex justify-between items-center bg-blue-100 p-2 rounded">
                    <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 underline truncate mr-2">
                      {pdf.key.split("/").pop()}
                    </a>
                    <button
                      onClick={() => handlePdfDelete(pdf.key)}
                      disabled={sending}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* =========================
            右：プレビュー
        ========================= */}
        <div className="border border-blue-200 rounded-lg bg-blue-50 p-4 h-[600px] overflow-auto">

          <h3 className="text-blue-800 font-semibold mb-3">
            プレビュー
          </h3>

          <div className="prose max-w-none prose-headings:text-blue-900 prose-a:text-blue-600 prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                p: ({ node, ...props }) => (
                  <p {...props} style={{ margin: "0 0 1.1rem 0", lineHeight: 1.8 }} />
                ),
                a: ({ node, ...props }) => {
                  const href = props.href || "";
                  if (href.endsWith(".pdf")) {
                    return (
                      <div className="not-prose flex items-center gap-2 p-3 mb-3 border border-blue-200 rounded-lg bg-blue-100">
                        <span className="text-2xl">📄</span>
                        <span className="flex-1 text-blue-700">{props.children}</span>
                        <a href={href} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-blue-600 text-white rounded text-sm">
                          PDF
                        </a>
                      </div>
                    );
                  }
                  return <a {...props} target="_blank" rel="noopener noreferrer" />;
                },
                img: ({ node, ...props }) => (
                  <img {...props} style={{ maxWidth: "100%", margin: "8px 0", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                ),
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>

          {pdfs.length > 0 && (
            <div className="mt-4 space-y-2">
              {pdfs.map((pdf) => (
                <div key={pdf.key} className="flex items-center gap-2 p-3 border border-blue-200 rounded-lg bg-blue-100">
                  <span className="text-2xl">📄</span>
                  <span className="flex-1 text-blue-700 truncate">{pdf.key.split("/").pop()}</span>
                  <a
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-blue-600 text-white rounded text-sm shrink-0"
                  >
                    ダウンロード
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

export default MarkdownImageUploader;
