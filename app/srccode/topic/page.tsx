"use client"; // Next.js 13 appディレクトリの場合
import { useState, useEffect } from "react";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { GoogleAuthProvider } from "firebase/auth";
import { getAuth,onAuthStateChanged, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, reload } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { sign } from "crypto";
// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';

const firebaseConfig = {
  apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
  authDomain: "share-info-project.firebaseapp.com",
  projectId: "share-info-project",
  storageBucket: "share-info-project.firebasestorage.app",
  messagingSenderId: "10017220780",
  appId: "1:10017220780:web:4820d384929f2d84735709",
  measurementId: "G-42VYEZ51GF"
};

const app = initializeApp(firebaseConfig);

export default function Main() {

  const auth = getAuth();
  const user = auth.currentUser;

  // const [fetchData, setFetchData] = useState({});
  // let topicdata ;

  const router = useRouter();

  // const [data, setData] = useState<Record<string, any> | null>(null);
  // const [results, setResults] = useState<Record<string, any> | null>(null);

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

const [results, setResults] = useState<Topic[]>([]);

  async function fetchtopicdata() {
    try {
      const response = await fetch("http://localhost:8080/topics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // HTTPステータスチェック
      if (!response.ok) {
        console.error(`HTTPエラー: ${response.status} ${response.statusText}`);
        return;
      }

      console.log("トピックデータの取得に成功");
      console.log(response);

      // const result = await response.json();
      // console.log("取得したトピックデータをjsonに変換");
      // console.log(result);

      const result = await response.json();
      setResults(result.topics); // ←ここ重要

      // setData(result);
      // setResults(result);

      // console.log("データの一部を取り出し");
      // console.log(result.topics[0]);

    } catch (error) {
      console.error("トピックデータの取得中にエラーが発生しました:", error);
    }
  }

  useEffect(() => {
      fetchtopicdata();
  }, []);



  const [topicName, setTopicName] = useState("");
  const [topicContent, setTopicContent] = useState("");

  async function sendinfo() {
    try {
      // 現在のユーザーのトークンを取得

      const auth = getAuth();
      const user = auth.currentUser;


      if (!user) {
        console.error("ユーザーがログインしていません");
        return;
      }

      const idToken = await user.getIdToken();
      console.log("現在のユーザーのIDトークン:", idToken);

      // POST リクエスト送信
      const response = await fetch("http://localhost:8080/topiccontent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: topicName, content: topicContent, token: idToken }),
      });

      // HTTP ステータスチェック
      if (!response.ok) {
        console.error(`HTTPエラー: ${response.status} ${response.statusText}`);
        return;
      }

      // レスポンスを JSON として取得
      const data = await response.json();
      console.log("トピックの送信に成功");
      console.log(data);

      // 必要であればページリロード
      window.location.reload();

    } catch (error) {
      // トークン取得や fetch エラーをキャッチ
      console.error("送信中にエラーが発生しました:", error);
    }
  }

  function road_to_topic(id : String) {

    router.push('/srccode/topiccontents/' + id);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-6">

      <div className="w-full max-w-3xl">

        <h1 className="text-4xl font-bold mb-10 text-center text-indigo-700">
          トピック掲示板です
        </h1>

        {/* 投稿フォーム */}
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-10">

          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            新しいトピックを作成
          </h2>

          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await sendinfo();
            }}
          >

            <input
              type="text"
              name="topicname"
              placeholder="トピック名"
              value={topicName}
              onChange={(e)=>setTopicName(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <textarea
              name="topiccontent"
              placeholder="内容"
              value={topicContent}
              onChange={(e)=>setTopicContent(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              type="submit"
              className="bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
            >
              投稿する
            </button>

          </form>

        </div>


        {/* トピック一覧 */}
        <div>

          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            トピック一覧
          </h2>

          {(!results || results.length === 0) ? (
            <p className="text-gray-500 text-center">
              まだ投稿がありません
            </p>
          ) : (

            <div className="flex flex-col gap-5">

              {results.map((topic) => (

                <div
                  key={topic.ID}
                  className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition"
                >

                  <button
                    className="text-left w-full"
                    onClick={() => road_to_topic(String(topic.ID))}
                  >

                    <h3 className="text-xl font-bold text-indigo-600">
                      {topic.TopicName}
                    </h3>

                    <p className="text-gray-700 mt-2">
                      {topic.Content}
                    </p>

                    <div className="text-sm text-gray-400 mt-4">
                      <div>作成者ID: {topic.UserID}</div>
                      <div>
                        作成日: {new Date(topic.CreatedAt).toLocaleString()}
                      </div>
                    </div>

                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}