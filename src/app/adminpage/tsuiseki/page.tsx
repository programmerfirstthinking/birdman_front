"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebaseconfig/firebase";
import { API_BASE_URL } from "../../api/api";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

type LogEntry = {
  id: number;
  user_id: number;
  user_name: string;
  action: string;
  target_type: string;
  target_id: number;
  parent_id: number;
  target_name: string;
  created_at: string;
};

const ACTION_LABEL: Record<string, string> = {
  create: "作成",
  edit: "編集",
  delete: "削除",
};

const TARGET_LABEL: Record<string, string> = {
  topic: "トピック",
  topic_comment: "コメント",
  group: "グループ",
  group_content: "グループ記事",
};

const ACTION_COLOR: Record<string, string> = {
  create: "#16a34a",
  edit: "#d97706",
  delete: "#dc2626",
};

function getTargetPath(log: LogEntry): string | null {
  switch (log.target_type) {
    case "topic":
      return `/topiccontents/${log.target_id}`;
    case "topic_comment":
      return log.parent_id > 0 ? `/topiccontents/${log.parent_id}` : null;
    case "group":
      return log.parent_id > 0 ? `/school_topic/${log.parent_id}` : null;
    case "group_content":
      return `/see_school_topic/${log.target_id}`;
    default:
      return null;
  }
}

export default function TsuisekiPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/signup");
        return;
      }
      try {
        const idToken = await user.getIdToken();
        const res = await fetch(`${API_BASE_URL}/admin/activity_logs`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "取得失敗");
        }
        setLogs(await res.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <button
        onClick={() => router.push("/adminpage")}
        style={{ marginBottom: "16px", padding: "6px 14px", cursor: "pointer" }}
      >
        ← 戻る
      </button>

      <h1 style={{ marginBottom: "16px" }}>操作ログ（最新100件）</h1>

      {loading && <p>読み込み中...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && logs.length === 0 && <p>ログはありません</p>}

      {!loading && !error && logs.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={th}>日時</th>
              <th style={th}>ユーザー</th>
              <th style={th}>操作</th>
              <th style={th}>対象</th>
              <th style={th}>名称</th>
              <th style={th}>ID</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const targetPath = getTargetPath(log);
              return (
                <tr key={log.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={td}>{new Date(log.created_at).toLocaleString("ja-JP")}</td>

                  {/* ユーザー名 → プロフィールページ */}
                  <td style={td}>
                    <span
                      onClick={() => router.push(`/user_profile/${log.user_id}`)}
                      style={{ color: "#2563eb", cursor: "pointer", textDecoration: "underline" }}
                    >
                      {log.user_name}
                    </span>
                  </td>

                  {/* 操作種別 */}
                  <td style={{ ...td, fontWeight: "bold", color: ACTION_COLOR[log.action] ?? "#374151" }}>
                    {ACTION_LABEL[log.action] ?? log.action}
                  </td>

                  {/* 対象種別 → コンテンツページ */}
                  <td style={td}>
                    {targetPath ? (
                      <span
                        onClick={() => router.push(targetPath)}
                        style={{ color: "#2563eb", cursor: "pointer", textDecoration: "underline" }}
                      >
                        {TARGET_LABEL[log.target_type] ?? log.target_type}
                      </span>
                    ) : (
                      TARGET_LABEL[log.target_type] ?? log.target_type
                    )}
                  </td>

                  {/* 名称 → コンテンツページ */}
                  <td style={{ ...td, maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {targetPath && log.target_name ? (
                      <span
                        onClick={() => router.push(targetPath)}
                        style={{ color: "#2563eb", cursor: "pointer", textDecoration: "underline" }}
                      >
                        {log.target_name}
                      </span>
                    ) : (
                      log.target_name || "—"
                    )}
                  </td>

                  <td style={{ ...td, color: "#9ca3af" }}>{log.target_id}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  padding: "8px 12px",
  textAlign: "left",
  borderBottom: "2px solid #d1d5db",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "6px 12px",
};
