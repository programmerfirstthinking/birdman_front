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

  // const app = initializeApp(firebaseConfig);

  // function GetTopicdata(id: ParamValue) {
  //   fetch(`http://localhost:8080/topic_comment_only/${id}`, {
  //     method: "GET",
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("取得失敗");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("取得成功:", data.comments);
  //       setComments(data.comments);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

    //   function GetTopicdata(id: ParamValue) {
    //   fetch(`http://localhost:8080/topic_comment_only/${id}`, {
    //     method: "GET",
    //   })
    //     .then((response) => {
    //       if (!response.ok) {
    //         throw new Error("取得失敗");
    //       }
    //       return response.json();
    //     })
    //     .then((data) => {
    //       console.log("コメントの取得成功:", data.comments);
    //       console.log("トピック情報の取得成功:", data.topicinfo);
    //       console.log("IDとnameリスト", data.users);

    //       setComments(data.comments);
    //       setResults(data.topicinfo);
    //       setUsers(data.users); // ← 追加
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // }

    // import { getAuth } from "firebase/auth";

    async function GetTopicdata(id: ParamValue) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.error("ユーザーがログインしていません");
          return;
        }

        const idToken = await user.getIdToken();
        console.log("現在のユーザーのIDトークン:", idToken);

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

      // const params = useParams();
      // const id = params.id;

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("ユーザーがログインしていません");
        return;
      }

      const idToken = await user.getIdToken();
      console.log("現在のユーザーのIDトークン:", idToken);


      // const response = await fetch("http://localhost:8080/topic_comment", {
      const response = await fetch(`${API_BASE_URL}/topic_comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topicId:id, topic_comment:topic_comment, token: idToken }),
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

  }

  async function deleteComment(commentId: number, commentUserId: number) {
    if (!confirm("このコメントを削除してもよろしいですか？")) {
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/deleteTopicComment/${commentId}/${commentUserId}`,
      {
        method: "DELETE",
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
                className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                className="w-full h-32 p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              />
            ) : (
              // <div className="text-blue-800">{results?.Content}</div>
              <div className="text-blue-800 whitespace-pre-line">{results?.Content}</div>
            )}
          </div>

          <div className="mb-3">
            <h4 className="text-blue-700 font-semibold">投稿者</h4>
            <div className="text-blue-800 font-medium">
              {topicOwner?.name ?? getUserName(results?.UserID ?? 0)}
            </div>
            <div className="text-blue-700 text-sm mt-1">
              学校: {topicOwner?.school_name ?? getUserSchoolName(results?.UserID ?? 0)}
            </div>
            {/* <div className="text-blue-700 text-sm">
              school_id: {topicOwner?.school_id ?? getUserSchoolId(results?.UserID ?? 0) ?? "不明"}
            </div> */}
          </div>

          {/* 編集ボタン */}
          {/* {currentUser && results?.UserID === currentUser.id && !isEditing && (
            <div>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditTitle(results?.TopicName || "");
                    setEditContent(results?.Content || "");
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  編集
                </button>
                <button>削除</button>

            </div>
            
            
          )} */}

          {/* 編集ボタンと削除ボタン */}
          {currentUser && results?.UserID === currentUser.id && !isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditTitle(results?.TopicName || "");
                  setEditContent(results?.Content || "");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                編集
              </button>

              {/* <button
                onClick={async () => {
                  const auth = getAuth();
                  const user = auth.currentUser;
                  if (!user) return;

                  const idToken = await user.getIdToken();

                  if (!confirm("本当にこのグループを削除しますか？")) return;

                  try {
                    // DELETE /groups/:id へリクエスト
                    const res = await fetch(`${API_BASE_URL}/groups/${id}`, {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`, // 認証トークン
                      },
                    });

                    if (!res.ok) {
                      const errData = await res.json();
                      console.error("削除エラー:", errData);
                      alert(errData.error || "グループ削除に失敗しました");
                      return;
                    }

                    // 削除成功
                    alert("グループを削除しました");
                    router.push("/topic")
                    
                    // グループ一覧ページなどへ遷移
                    // window.location.href = "/groups"; // 必要に応じて変更
                  } catch (err) {
                    console.error("グループ削除エラー:", err);
                    alert("グループ削除に失敗しました");
                  }
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                削除
              </button> */}
              <button
                onClick={async () => {
                  // 1. ID が存在するか確認
                  if (!id) {
                    alert("削除対象のトピックIDが取得できていません");
                    return;
                  }

                  // 2. 確認ダイアログ
                  if (!confirm("本当にこのトピックを削除しますか？")) return;

                  try {
                    // 3. Firebase 現在ユーザーとトークン取得
                    const auth = getAuth();
                    const user = auth.currentUser;
                    if (!user) {
                      alert("ログインしていません");
                      return;
                    }

                    const idToken = await user.getIdToken();

                    // 4. バックエンドの DELETE エンドポイント
                    const deleteUrl = `${API_BASE_URL.replace(/\/$/, "")}/deleteTopic/${id}`;
                    console.log("DELETE URL:", deleteUrl);

                    // 5. DELETE リクエスト送信
                    const res = await fetch(deleteUrl, {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`, // Firebase トークン
                      },
                    });

                    // 6. レスポンスチェック
                    if (!res.ok) {
                      const errData = await res.json();
                      console.error("削除エラー:", errData);
                      alert(errData.error || "トピック削除に失敗しました");
                      return;
                    }

                    // 7. 削除成功
                    alert("トピックを削除しました");
                    router.push("/topic"); // トピック一覧ページへ遷移

                  } catch (err) {
                    console.error("トピック削除エラー:", err);
                    alert("トピック削除に失敗しました");
                  }
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                削除
              </button>
            </div>
          )}

          {/* 保存ボタン（編集時のみ） */}
          {isEditing && (
            <button
              onClick={async () => {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) return;

                const idToken = await user.getIdToken();

                // await fetch("http://localhost:8080/edit_topic", {
                await fetch(`${API_BASE_URL}/edit_topic`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    topicId: Number(id),
                    title: editTitle,
                    content: editContent,
                    token: idToken,
                  }),
                });

                setIsEditing(false);
                GetTopicdata(id);
              }}
              className="ml-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
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
                    className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none mb-2 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        const auth = getAuth();
                        const user = auth.currentUser;
                        if (!user) return;

                        const idToken = await user.getIdToken();

                        // await fetch("http://localhost:8080/edit_topic_comment", {
                        await fetch(`${API_BASE_URL}/edit_topic_comment`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            commentId: comment.ID,
                            content: editCommentContent,
                            token: idToken,
                          }),
                        });

                        setEditingCommentId(null);
                        GetTopicdata(id);
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
                    >
                      キャンセル
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* <p className="text-blue-800 mb-1">{comment.Content}</p> */}
                  <p className="text-blue-800 mb-1 whitespace-pre-line">{comment.Content}</p>
                  <p className="text-blue-700 text-sm mb-1">
                    ユーザー: {getUserName(comment.UserID)}
                  </p>
                  <p className="text-blue-700 text-sm mb-1">
                    学校: {getUserSchoolName(comment.UserID)} 
                    {/* (school_id: {getUserSchoolId(comment.UserID) ?? "不明"}) */}
                  </p>
                  {/* <p className="text-blue-700 text-sm mb-2">作成日時: {comment.CreatedAt}</p> */}
                  <p className="text-blue-700 text-sm mb-2">
                    作成日時: {new Date(comment.CreatedAt).toLocaleString()}
                  </p>
                  {currentUser && comment.UserID === currentUser.id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCommentId(comment.ID);
                          setEditCommentContent(comment.Content);
                        }}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => deleteComment(comment.ID, comment.UserID)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition"
                      >
                        削除
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* コメント投稿フォーム */}
        <div>
          <h3 className="text-lg font-bold text-blue-800 mb-2">
            コメントを投稿
          </h3>
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
              className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition w-32"
            >
              投稿
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}