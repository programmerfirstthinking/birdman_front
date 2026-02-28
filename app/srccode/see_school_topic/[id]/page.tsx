// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type School = {
//   ID: number;
//   SchoolName: string;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

// export default function SchoolsPage() {



  


//   return (
//     <div>
//       <h2>スクールトピックを見る</h2>


        
      
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";

// export default function SchoolsPage() {
//   const [schoolId, setSchoolId] = useState<number | null>(null);
//   const [responseData, setResponseData] = useState<any>(null);

//   useEffect(() => {
//     // URL の最後の数字を取得
//     const pathParts = window.location.pathname.split("/").filter(Boolean);
//     const lastPart = pathParts[pathParts.length - 1];
//     const parsedId = parseInt(lastPart, 10);

//     if (!isNaN(parsedId)) {
//       setSchoolId(parsedId);

//       // 取得した ID を使って fetch
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

//   return (
//     <div style={{ padding: "16px" }}>
//       <h2>スクールトピックを見る</h2>
//       {schoolId && <p>送信したスクールID: {schoolId}</p>}
//       {responseData && (
//         <pre style={{ background: "#eee", padding: "8px" }}>
//           {JSON.stringify(responseData, null, 2)}
//         </pre>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

export default function SchoolsPage() {
  const [contentId, setContentId] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any>(null);

  useEffect(() => {
    // URL の最後の数字を取得
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const parsedId = parseInt(lastPart, 10);

    if (!isNaN(parsedId)) {
      setContentId(parsedId);

      // 取得した ID を使って fetch
      fetchData(parsedId);
    } else {
      console.error("URL から有効な数字を取得できませんでした");
    }
  }, []);

  const fetchData = async (id: number) => {
    try {
      const res = await fetch("http://localhost:8080/see_groupcontent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: id }), // Go 側で req.ContentID として受け取る
      });

      if (!res.ok) throw new Error("Fetch エラー");

      const data = await res.json();
      setResponseData(data);
      console.log("取得データ:", data);
    } catch (err: any) {
      console.error("Fetch エラー:", err.message);
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>スクールトピックを見る</h2>

      {contentId && <p>送信したコンテンツID: {contentId}</p>}

        {responseData ? (
          <div style={{ marginTop: "16px" }}>
            <h3>コンテンツ詳細:</h3>
            <p><strong>ID:</strong> {responseData.data?.ID}</p>
            <p><strong>グループID:</strong> {responseData.data?.GroupID}</p>
            <p><strong>スクールID:</strong> {responseData.data?.SchoolID}</p>
            <p><strong>名前:</strong> {responseData.data?.GroupContentsName}</p>
            <p><strong>本文:</strong> {responseData.data?.Content}</p>
            <p><strong>作成日時:</strong> {new Date(responseData.data?.CreatedAt).toLocaleString()}</p>
            <p><strong>更新日時:</strong> {new Date(responseData.data?.UpdatedAt).toLocaleString()}</p>
          </div>
        ) : (
          <p>データを取得中…</p>
        )}
    </div>
  );
}