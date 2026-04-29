




"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/api";

// export const API_BASE_URL = "http://localhost:8080";

type Group = {
  id: number;
  user_id: number;
  school_id: number | null;
  created_at: string;
  updated_at: string;
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);

  // 全グループ取得
  const fetchGroups = () => {
    fetch(`${API_BASE_URL}/groups_list`)
      .then(res => res.json())
      .then(data => setGroups(data))
      .catch(err => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // 削除ハンドラ
  const handleDelete = (id: number) => {
    if (!confirm("本当に削除しますか？")) return;

    fetch(`${API_BASE_URL}/groups/${id}`, {
      method: "DELETE",
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        // 削除成功したら一覧を再取得
        fetchGroups();
      })
      .catch(err => console.error("Delete error:", err));
  };

  return (
    <div>
      <h1>全グループ一覧</h1>
      <ul>
        {groups.map((group, index) => (
          <li key={group.id ?? index}>
            ID: {group.id}, UserID: {group.user_id}, SchoolID: {group.school_id}, CreatedAt: {group.created_at}
            <button
              style={{ marginLeft: "10px", color: "red" }}
              onClick={() => handleDelete(group.id)}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}