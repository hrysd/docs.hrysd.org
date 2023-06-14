---
layout: post
title: JOIN 先のレコードの最大値を取る
date: 2023-06-14 23:00
categories: SQL
---

JOIN 先のレコードのある属性の最大値を取得したいみたいな SQL を書くことが稀によくあるんだけど、そのたびにえ〜とと悩むのでサクッとコピペできるようにここに残しておく。

例としては、ユーザといいねのテーブルがあって、ユーザーごとに最近できたいいねのタイミングをとりたい。

複数回結合、結合の条件に自身より値が大きいレコードか判定して存在チェックするという感じ。
以下の SQL はコピーして、[このあたり](https://sql.js.org/examples/GUI/index.html) に貼り付けると動かせる。

```sql
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS likes;

CREATE TABLE users (id integer);
CREATE TABLE likes (user_id integer, created_at TIMESTAMP);

INSERT INTO users VALUES (1);
INSERT INTO users VALUES (2);
INSERT INTO users VALUES (3);

INSERT INTO likes VALUES (1, '2022-01-01 00:00:00');
INSERT INTO likes VALUES (1, '2023-01-03 00:00:00');

INSERT INTO likes VALUES (2, '2023-01-01 00:00:00');
INSERT INTO likes VALUES (2, '2023-01-05 00:00:00');

SELECT
  users.id,
  likes.created_at
FROM
  users
INNER JOIN likes on likes.user_id = users.id
LEFT OUTER JOIN likes l2 on l2.user_id = users.id and likes.created_at < l2.created_at
WHERE l2.user_id IS NULL;
```

結果はこんな感じ。

| id | created_at |
|---|---|
| 1 | 2023-01-03 00:00:00 |
| 2 | 2023-01-05 00:00:00 |

## 最後に

これ、greatest n per group みたいな名前がついているっぽくて、勉強になった。
なお [SQL.js](https://sql.js.org) のデモを見ておもしろかったのでクエリに関する話を書きたいと思ったのであった...
