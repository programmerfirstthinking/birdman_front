"use client";

import { ParamValue } from "next/dist/server/request/params";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Page() {
  const params = useParams();
  const id = params.id;


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



  function GetTopicdata(id: ParamValue) {
    fetch("http://localhost:8080/topics/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("トピックデータの取得に成功");
        console.log(data.topics);
        setResults(data.topics); // ←ここ重要
      })
      .catch((error) => {
        console.error(error);
        // alert(`トピックデータの取得エラー: ${error.message}`);
      });
   }

    useEffect(() => {
      if (id) {
        GetTopicdata(id);
      }
    }, [id]);



  return (
    <div>
      <h1>URLの最後</h1>
      <p>{id}</p>
      <div>{results?.ID}</div>
      <div>{results?.TopicName}</div>
      <div>{results?.Content}</div>
    </div>
  );
}