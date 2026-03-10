export default function HowToUse() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
        ホームページの使い方
      </h2>

      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          この掲示板では、学校ごとの情報交換やトピックの作成、グループの作成を行うことができます。
          初めて利用する方は、以下の手順に従って操作してください。
        </p>

        <ol className="list-decimal list-inside space-y-3">
          <li>
            <span className="font-semibold">学校一覧</span> ボタンを押すと、
            登録されている学校の一覧を見ることができます。
          </li>

          <li>
            学校を選択すると、その学校に関する
            <span className="font-semibold">トピック一覧</span>が表示されます。
          </li>

          <li>
            トピック一覧ページでは、
            <span className="font-semibold">新しいトピックを作成</span>
            することができます。
          </li>

          <li>
            トピックの詳細ページでは、他のユーザーの投稿を読んだり、
            <span className="font-semibold">コメント</span>
            を追加することができます。
          </li>

          <li>
            また、ユーザーは
            <span className="font-semibold">グループ作成ページ</span>
            から新しいグループを作ることもできます。
          </li>

          <li>
            画面上部やボタンにある
            <span className="font-semibold">ホームに戻る</span>
            を押すと、いつでもトップページに戻ることができます。
          </li>
        </ol>

        <p className="mt-6 text-center text-gray-600">
          このサイトを通じて、学校ごとの情報交換を楽しんでください。
        </p>
      </div>
    </div>
  );
}