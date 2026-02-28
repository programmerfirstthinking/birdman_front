// "use client";

// import { useEffect, useState } from "react";



// const parseContent = (text: string) => {
//   const parts: { type: "text" | "image" | "pdf"; content: string; name?: string }[] = [];

//   const regex = /!\[(.*?)\]\((.*?)\)|\[(.*?)\.pdf\]\((.*?)\)/gi;
//   let lastIndex = 0;
//   let match;

//   while ((match = regex.exec(text)) !== null) {
//     if (match.index > lastIndex) {
//       parts.push({ type: "text", content: text.substring(lastIndex, match.index) });
//     }

//     // match[1], match[2] = ![alt](url) のキャプチャ
//     // match[3], match[4] = [name.pdf](url.pdf) のキャプチャ
//     if (match[2]?.toLowerCase().endsWith(".pdf")) {
//       // ![]() 内 PDF
//       const name = match[1]?.endsWith(".pdf") ? match[1] : match[1] + ".pdf";
//       parts.push({ type: "pdf", content: match[2], name });
//     } else if (match[4]) {
//       // [name.pdf](url.pdf)
//       const name = match[3] + ".pdf";
//       parts.push({ type: "pdf", content: match[4], name });
//     } else if (match[2]) {
//       // 画像
//       parts.push({ type: "image", content: match[2] });
//     }

//     lastIndex = regex.lastIndex;
//   }

//   if (lastIndex < text.length) {
//     parts.push({ type: "text", content: text.substring(lastIndex) });
//   }

//   return parts;
// };

// export default function SchoolsPage() {
//   const [contentId, setContentId] = useState<number | null>(null);
//   const [responseData, setResponseData] = useState<any>(null);

//   useEffect(() => {
//     const pathParts = window.location.pathname.split("/").filter(Boolean);
//     const lastPart = pathParts[pathParts.length - 1];
//     const parsedId = parseInt(lastPart, 10);

//     if (!isNaN(parsedId)) {
//       setContentId(parsedId);
//       fetchData(parsedId);
//     } else {
//       console.error("URL から有効な数字を取得できませんでした");
//     }
//   }, []);

//   const fetchData = async (id: number) => {
//     try {
//       const res = await fetch("http://localhost:8080/see_groupcontent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content: id }),
//       });
//       if (!res.ok) throw new Error("Fetch エラー");
//       const data = await res.json();
//       setResponseData(data);
//       console.log("取得データ:", data);
//     } catch (err: any) {
//       console.error("Fetch エラー:", err.message);
//     }
//   };

//   if (!responseData) return <p>データを取得中…</p>;

//   const contentText: string = responseData.data?.Content || "";
//   const contentParts = parseContent(contentText);

//   return (
//     <div style={{ padding: "16px" }}>
//       <h2>スクールトピックを見ましょう</h2>
//       {contentId && <p>送信したコンテンツID: {contentId}</p>}

//       <div style={{ marginTop: "16px" }}>
//         <h3>コンテンツ詳細:</h3>
//         <p><strong>ID:</strong> {responseData.data?.ID}</p>
//         <p><strong>グループID:</strong> {responseData.data?.GroupID}</p>
//         <p><strong>スクールID:</strong> {responseData.data?.SchoolID}</p>
//         <p><strong>名前:</strong> {responseData.data?.GroupContentsName}</p>
//         <p><strong>本文:</strong></p>
//        <div>
//         {contentParts.map((part, idx) => {
//           if (part.type === "image") {
//             return (
//               <img
//                 key={idx}
//                 src={part.content}
//                 alt={`画像 ${idx}`}
//                 style={{ maxWidth: "100%", height: "auto", margin: "8px 0" }}
//               />
//             );
//           } else if (part.type === "pdf") {
//             return (
//               <div
//                 key={idx}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   border: "1px solid #ccc",
//                   padding: "8px",
//                   margin: "8px 0",
//                   backgroundColor: "#f9f9f9",
//                   borderRadius: "4px",
//                 }}
//               >
//                 {/* PDF アイコン */}
//                 <span style={{ fontSize: "24px" }}>📄</span>

//                 {/* PDF 名称 */}
//                 <span style={{ flex: 1 }}>{part.name || `PDF ${idx + 1}`}</span>

//                 {/* ダウンロードリンク */}
//                 <a
//                   href={part.content}
//                   download={part.name || `download_${idx}.pdf`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{
//                     backgroundColor: "#0070f3",
//                     color: "white",
//                     padding: "4px 8px",
//                     borderRadius: "4px",
//                     textDecoration: "none",
//                     fontSize: "14px",
//                   }}
//                 >
//                   ダウンロード
//                 </a>
//               </div>
//             );
//           } else {
//             return <p key={idx}>{part.content}</p>;
//           }
//         })}
//       </div>

//         <p><strong>作成日時:</strong> {new Date(responseData.data?.CreatedAt).toLocaleString()}</p>
//         <p><strong>更新日時:</strong> {new Date(responseData.data?.UpdatedAt).toLocaleString()}</p>
//       </div>
//     </div>
//   );
// }








"use client";

import { useEffect, useState } from "react";

/* ================================
   型定義（any禁止・安全設計）
================================ */
type GroupContent = {
  id: number;
  user_id: number;
  school_id: number;
  group_id: number;
  group_contents_name: string;
  content: string;
  pdf_url: string;
  created_at: string;
  updated_at: string;
};

type ApiResponse = {
  message: string;
  data: GroupContent;
};

/* ================================
   Markdown風パーサ
================================ */
const parseContent = (text: string) => {
  const parts: { type: "text" | "image" | "pdf"; content: string; name?: string }[] = [];

  const regex = /!\[(.*?)\]\((.*?)\)|\[(.*?)\.pdf\]\((.*?)\)/gi;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.substring(lastIndex, match.index) });
    }

    if (match[2]?.toLowerCase().endsWith(".pdf")) {
      const name = match[1]?.endsWith(".pdf") ? match[1] : match[1] + ".pdf";
      parts.push({ type: "pdf", content: match[2], name });
    } else if (match[4]) {
      const name = match[3] + ".pdf";
      parts.push({ type: "pdf", content: match[4], name });
    } else if (match[2]) {
      parts.push({ type: "image", content: match[2] });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.substring(lastIndex) });
  }

  return parts;
};

/* ================================
   メインコンポーネント
================================ */
export default function SchoolsPage() {
  const [contentId, setContentId] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);

  /* ----------------------------
     URLからID取得
  ---------------------------- */
  useEffect(() => {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const parsedId = parseInt(lastPart, 10);

    if (!isNaN(parsedId)) {
      setContentId(parsedId);
      fetchData(parsedId);
    } else {
      console.error("URL から有効な数字を取得できませんでした");
    }
  }, []);

  /* ----------------------------
     データ取得
  ---------------------------- */
  const fetchData = async (id: number) => {
    try {
      const res = await fetch("http://localhost:8080/see_groupcontent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: id }),
      });

      if (!res.ok) throw new Error("Fetch エラー");

      const data: ApiResponse = await res.json();
      setResponseData(data);
      console.log("取得データ:", data);
    } catch (err: any) {
      console.error("Fetch エラー:", err.message);
    }
  };

  if (!responseData) return <p>データを取得中…</p>;

  const contentText: string = responseData.data?.content || "";
  const contentParts = parseContent(contentText);

  return (
    <div style={{ padding: "16px" }}>
      <h2>スクールトピックを見ましょう</h2>

      {contentId && <p>送信したコンテンツID: {contentId}</p>}

      <div style={{ marginTop: "16px" }}>
        <h3>コンテンツ詳細:</h3>

        <p><strong>ID:</strong> {responseData.data.id}</p>
        <p><strong>グループID:</strong> {responseData.data.group_id}</p>
        <p><strong>スクールID:</strong> {responseData.data.school_id}</p>
        <p><strong>名前:</strong> {responseData.data.group_contents_name}</p>

        <p><strong>本文:</strong></p>

        <div>
          {contentParts.map((part, idx) => {
            if (part.type === "image") {
              return (
                <img
                  key={idx}
                  src={part.content}
                  alt={`画像 ${idx}`}
                  style={{ maxWidth: "100%", height: "auto", margin: "8px 0" }}
                />
              );
            } else if (part.type === "pdf") {
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid #ccc",
                    padding: "8px",
                    margin: "8px 0",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "4px",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>📄</span>
                  <span style={{ flex: 1 }}>{part.name || `PDF ${idx + 1}`}</span>
                  <a
                    href={part.content}
                    download={part.name || `download_${idx}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    ダウンロード
                  </a>
                </div>
              );
            } else {
              return <p key={idx}>{part.content}</p>;
            }
          })}
        </div>

        {/* =============================
           DB保存された pdf_url 表示
        ============================== */}
        {responseData.data.pdf_url && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #ccc",
              padding: "8px",
              margin: "16px 0",
              backgroundColor: "#f0f8ff",
              borderRadius: "4px",
            }}
          >
            <span style={{ fontSize: "24px" }}>📄</span>
            <span style={{ flex: 1 }}>添付PDF</span>
            <a
              href={responseData.data.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "#0070f3",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              開く
            </a>
          </div>
        )}

        <p><strong>作成日時:</strong> {new Date(responseData.data.created_at).toLocaleString()}</p>
        <p><strong>更新日時:</strong> {new Date(responseData.data.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
}