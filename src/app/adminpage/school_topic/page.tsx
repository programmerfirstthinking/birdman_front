
"use client";

import { useEffect, useState } from "react";

export const API_BASE_URL = "http://localhost:8080";

type GroupContent = {
  id: number;
  user_id: number;
  school_id: number | null;
  group_id: number;
  group_contents_name: string;
  content: string;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
};

export default function GroupContentsPage() {
  const [contents, setContents] = useState<GroupContent[]>([]);

  const fetchContents = () => {
    fetch(`${API_BASE_URL}/group_contents_list`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => setContents(data))
      .catch(err => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchContents();
  }, []);

  // 削除ハンドラ
  const handleDelete = (id: number) => {
    if (!confirm("本当に削除しますか？")) return;

    fetch(`${API_BASE_URL}/group_contents/${id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        // 削除後に再取得
        fetchContents();
      })
      .catch(err => console.error("Delete error:", err));
  };

  return (
    <div>
      <h1>全グループコンテンツ一覧</h1>
      <ul>
        {contents.map((c, index) => (
          <li key={c.id ?? index}>
            <strong>{c.group_contents_name}</strong> (GroupID: {c.group_id})
            <br />
            {c.content}
            <br />
            PDF: {c.pdf_url ? <a href={c.pdf_url} target="_blank">開く</a> : "なし"}
            <br />
            作成: {c.created_at}, 更新: {c.updated_at}
            <br />
            <button
              style={{ color: "red", marginTop: "5px" }}
              onClick={() => handleDelete(c.id)}
            >
              削除
            </button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}