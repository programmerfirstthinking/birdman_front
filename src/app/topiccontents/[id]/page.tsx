"use client";

import { ParamValue } from "next/dist/server/request/params";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
import { getAuth,onAuthStateChanged, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, reload } from "firebase/auth";
import { API_BASE_URL } from "../../api/api";
import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "../../firebaseconfig/firebase";
import { useRouter } from "next/navigation"
import Link from "next/link"

// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.firebasestorage.app",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF"
// };

// 既存の app があるか確認
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();




export default function Page() {
  const router = useRouter(); // コンポーネント内で
  const params = useParams();
  const id = params.id;

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  type CurrentUser = {
    id: number;
    name: string;
  };

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  type UserInfo = {
    id: number;
    name: string;
    school_id: number | null;
    school_name: string;
  };

  const [users, setUsers] = useState<UserInfo[]>([]);
  const [topicOwner, setTopicOwner] = useState<UserInfo | null>(null);

  type Topic = {
    ID: number;
    Year: number;
    UserID: number;
    TopicName: string;
    Content: string;
    Activate: boolean;
    Alert: boolean;
    CreatedAt: string;  // time.Time → stringで来る
    UpdatedAt: string;
  };
  
  const [results, setResults] = useState<Topic>();
  const [topic_comment, setTopicComment] = useState("");

  type Comment = {
    ID: number;
    UserID: number;
    TopicID: number;
    Content: string;
    CreatedAt: string;
  };

  const [comments, setComments] = useState<Comment[]>([]);


    async function GetTopicdata(id: ParamValue) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.error("ユーザーがログインしていません");
          return;
        }

        const idToken = await user.getIdToken();

        const response = await fetch(
          `${API_BASE_URL}/topic_comment_only/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,  // ← ここが重要
            },
          }
        );

        if (!response.ok) {
          console.error(`HTTPエラー: ${response.status} ${response.statusText}`);
          return;
        }

        const data = await response.json();

        setComments(data.comments);
        setResults(data.topicinfo);
        setUsers(data.users ?? []);
        setCurrentUser(data.currentuser);

        const owner = data.users?.find((u: UserInfo) => u.id === data.topicinfo?.UserID) ?? null;
        setTopicOwner(owner);

      } catch (error) {
        console.error("エラー:", error);
      }
    }

    function getUserName(userID: number) {
      const user = users.find((u) => u.id === userID);
      return user ? user.name : "不明なユーザー";
    }

    function getUserSchoolName(userID: number) {
      const user = users.find((u) => u.id === userID);
      return user ? user.school_name || "不明な学校" : "不明な学校";
    }

    function getUserSchoolId(userID: number) {
      const user = users.find((u) => u.id === userID);
      return user ? user.school_id : null;
    }


  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && id) {
        GetTopicdata(id);  // ← ログイン確定後に呼ぶ
      } else {
        console.log("ログインしていません");
      }
    });

    return () => unsubscribe();
  }, [id]);

  async function sendinfo() {
      const trimmedComment = topic_comment.trim();
      if (!trimmedComment) {
        alert("コメント内容を入力してください");
        return;
      }

      // const params = useParams();
      // const id = params.id;

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("ユーザーがログインしていません");
        return;
      }

      const idToken = await user.getIdToken();

      // const response = await fetch("http://localhost:8080/topic_comment", {
      const response = await fetch(`${API_BASE_URL}/topic_comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ topicId: id, topic_comment: trimmedComment }),
      });


      if (!response.ok) {
        console.error(`HTTPエラー: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();

      console.log("これがレスポンスです");
      console.log(data);
      console.log(data.comments);

      setComments(data.comments);
        setTopicComment("");

  }

  async function deleteComment(commentId: number, commentUserId: number) {
    if (!confirm("このコメントを削除してもよろしいですか？")) {
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("ログインが必要です");
      return;
    }
    const idToken = await user.getIdToken();

    const response = await fetch(
      `${API_BASE_URL}/deleteTopicComment/${commentId}/${commentUserId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`コメント削除エラー: ${response.status} ${response.statusText}`);
      alert("コメントの削除に失敗しました");
      return;
    }

    if (id) {
      await GetTopicdata(id);
    }
  }



return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 font-sans flex justify-center">
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">

      {/* トピック */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">トピック情報</h2>

        <div className="mb-3">
          <h4 className="text-blue-700 font-semibold">題名</h4>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 border border-blue-300 rounded-lg"
            />
          ) : (
            <div className="text-blue-800 font-medium">{results?.TopicName}</div>
          )}
        </div>

        <div className="mb-3">
          <h4 className="text-blue-700 font-semibold">内容</h4>
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-32 p-2 border border-blue-300 rounded-lg resize-none"
            />
          ) : (
            <div className="text-blue-800 whitespace-pre-line">
              {results?.Content}
            </div>
          )}
        </div>

        {/* ✅ 右寄せ修正ここ */}
        <div className="mb-3 text-sm text-blue-600 flex flex-col items-end text-right">
          <div>
            投稿者: {topicOwner?.name ?? getUserName(results?.UserID ?? 0)}
          </div>
          <div>
            学校: {topicOwner?.school_name ?? getUserSchoolName(results?.UserID ?? 0)}
          </div>
        </div>

        {currentUser && results?.UserID === currentUser.id && !isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(true);
                setEditTitle(results?.TopicName || "");
                setEditContent(results?.Content || "");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              編集
            </button>

            <button
              onClick={async () => {
                if (!id) return;
                if (!confirm("本当にこのトピックを削除しますか？")) return;

                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) return;

                const idToken = await user.getIdToken();

                const res = await fetch(`${API_BASE_URL}/deleteTopic/${id}`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                  },
                });

                if (!res.ok) {
                  alert("削除失敗");
                  return;
                }

                alert("削除成功");
                router.push("/topic");
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              削除
            </button>
          </div>
        )}

        {isEditing && (
          <button
            onClick={async () => {
              const trimmedEditTitle = editTitle.trim();
              const trimmedEditContent = editContent.trim();

              if (!trimmedEditTitle || !trimmedEditContent) {
                alert("トピック名と内容を入力してください");
                return;
              }

              if (trimmedEditTitle.length > 100) {
                alert("トピック名は 100 文字以内で入力してください");
                return;
              }

              if (trimmedEditContent.length > 5000) {
                alert("内容は 5000 文字以内で入力してください");
                return;
              }

              const auth = getAuth();
              const user = auth.currentUser;
              if (!user) return;

              const idToken = await user.getIdToken();

              const res = await fetch(`${API_BASE_URL}/edit_topic`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
                body: JSON.stringify({
                  topicId: Number(id),
                  title: trimmedEditTitle,
                  content: trimmedEditContent,
                }),
              });

              if (!res.ok) {
                const err = await res.json().catch(() => null);
                alert(err?.error ?? "トピック更新に失敗しました");
                return;
              }

              setIsEditing(false);
              GetTopicdata(id);
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            保存
          </button>
        )}
      </div>

      {/* コメント一覧 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-800 mb-4">コメント一覧</h2>

        {comments?.map((comment) => (
          <div
            key={comment.ID}
            className="mb-3 p-3 border border-blue-300 rounded-lg bg-blue-50"
          >
            {editingCommentId === comment.ID ? (
              <>
                <textarea
                  value={editCommentContent}
                  onChange={(e) => setEditCommentContent(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2"
                />

                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      const auth = getAuth();
                      const user = auth.currentUser;
                      if (!user) return;

                      const idToken = await user.getIdToken();

                      await fetch(`${API_BASE_URL}/edit_topic_comment`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
                        body: JSON.stringify({
                          commentId: comment.ID,
                          content: editCommentContent,
                        }),
                      });

                      setEditingCommentId(null);
                      GetTopicdata(id);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                  >
                    保存
                  </button>

                  <button
                    onClick={() => setEditingCommentId(null)}
                    className="px-3 py-1 bg-gray-300 rounded-lg"
                  >
                    キャンセル
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* 本文 */}
                <p className="text-blue-800 mb-2 whitespace-pre-line">
                  {comment.Content}
                </p>

                {/* 下段 */}
                <div className="flex items-end gap-3">

                  {/* 左：操作 */}
                  <div>
                    {currentUser && comment.UserID === currentUser.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.ID);
                            setEditCommentContent(comment.Content);
                          }}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                        >
                          編集
                        </button>

                        <button
                          onClick={() => deleteComment(comment.ID, comment.UserID)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                        >
                          削除
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 右：メタ情報 */}
                  <div className="ml-auto text-right text-xs text-blue-600">
                    <div>
                      <Link
                        href={`/user_profile/${comment.UserID}`}
                        className="hover:underline hover:text-blue-800"
                      >
                        ユーザー: {getUserName(comment.UserID)}
                      </Link>
                    </div>
                    <div>学校: {getUserSchoolName(comment.UserID)}</div>
                    <div>
                      {new Date(comment.CreatedAt).toLocaleString()}
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 投稿フォーム */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendinfo();
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          value={topic_comment}
          onChange={(e) => setTopicComment(e.target.value)}
          placeholder="コメント内容"
          className="p-2 border rounded-lg"
        />

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg w-32">
          投稿
        </button>
      </form>

    </div>
  </div>
);

}