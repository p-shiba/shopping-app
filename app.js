/*
2025-05-28
-progateの買い物メモアプリを再現
-ローカルのMySQLに接続成功
*/

require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const app = express();

app.set("view engine", "ejs"); //ChatGPTの提案で追加

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//MySQLの接続エラー確認

connection.connect((err) => {
  if (err) {
    console.error("MySQL接続エラー:", err);
    return;
  }
  console.log("MySQLに接続しました");
});

app.get("/", (req, res) => {
  res.render("top");
});

//indexルートが重複していため削除した

app.get("/new", (req, res) => {
  connection.query("SELECT * FROM items", (error, results) => {
    if (error) {
      console.error("SQL実行エラー:", error);
      return res.send("データの取得に失敗しました");
    }
    // 取得した結果を items として new.ejs に渡す
    res.render("new", { items: results });
  });
});

app.post("/create", (req, res) => {
  connection.query(
    "INSERT INTO items (name) VALUES (?)",
    [req.body.itemName],
    (error, results) => {
      res.redirect("/index");
    }
  );
});

app.post("/delete/:id", (req, res) => {
  connection.query(
    "DELETE FROM items WHERE id = ?",
    [req.params.id],
    (error, results) => {
      res.redirect("/index");
    }
  );
});

app.get("/edit/:id", (req, res) => {
  connection.query(
    "SELECT * FROM items WHERE id = ?",
    [req.params.id],
    (error, results) => {
      res.render("edit", { item: results[0] });
    }
  );
});

app.post("/update/:id", (req, res) => {
  // 選択されたメモを更新する処理を書いてください
  connection.query(
    "UPDATE items SET name = ? WHERE id = ?",
    [req.body.itemName, req.params.id],
    (error, results) => {
      res.redirect("/index");
    }
  );
  // 以下の一覧画面へリダイレクトする処理を削除してください
});

app.get("/index", (req, res) => {
  connection.query("SELECT * FROM items", (error, results) => {
    if (error) {
      console.error("SQL実行エラー:", error);
      res.send("データの取得に失敗しました");
      return;
    }
    res.render("index", { items: results });
  });
});

app.listen(3000, () => {
  console.log("サーバーがポート3000で起動しました");
});
