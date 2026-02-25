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
  let topicdata ;

  const router = useRouter();

  const [data, setData] = useState<Record<string, any> | null>(null);

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

      const result = await response.json();
      console.log("取得したトピックデータをjsonに変換");
      console.log(result);

      setData(result);

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


  return (
    <div>
      <h2>トピックの作成はこちら</h2>
        {/* <form  className="signup" method="POST"> */}
        <div></div>
        <form
            className="signup"
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
          />
          <input
            type="text"
            name="topiccontent"
            placeholder="内容"
            value={topicContent}
            onChange={(e)=>setTopicContent(e.target.value)}
          />
        <button type="submit">トピックの作成</button>
      </form>

      <div>
      {/* <button onClick={fetchData}>取得</button> */}

      {data && (
        <div>
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong>{" "}
              {typeof value === "object"
                ? JSON.stringify(value)
                : String(value)}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  )
}