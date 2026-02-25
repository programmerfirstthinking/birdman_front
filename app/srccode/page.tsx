import Link from "next/link"

// export default function Main() {
//   return (
//     <Link href="http://localhost:8080/test">
//       <button>Aboutへ</button>
//     </Link>
//   )
// }

export default function Main() {

  



  return (
    <div>
      <h1>ログインページ</h1>
      <form action="http://localhost:8080/login" method="POST">
        <input name="mail" placeholder="メルアド" />
        <input name="password" placeholder="パスワード" />
        <button type="submit">送信</button>
      </form>
      <h2>サインアップはこちら</h2>
      <Link href="srccode/signup" className="px-4 py-2 bg-blue-500 text-white">
        signupする
      </Link>
    </div>
  )
}