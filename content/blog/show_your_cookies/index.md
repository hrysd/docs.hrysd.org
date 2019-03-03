---
layout: post
title:  'show_your_cookies という gem を作りました'
date:   2015-04-07 21:00:00
categories: ruby
---

[hrysd/show\_your\_cookies](https://github.com/hrysd/show_your_cookies)

## なにこれ

Rails.logger に Cookie の中身をログする filter/action を追加するというだけの gem です。

最初は、自動で callback に追加してたんですが微妙だったのでやめました。


## なんで作ったか

- 画面ポチポチしてらたらいつの間にか `session` から値が消えてて、うぉぉぉぉぉぉぉお。
- 知らん間に書き込まれてる値はどこから来たんだよ..

みたいなのにあたりをつけやすくなるよう作ってみました。

## 実装方法

たいしてコードを書いてないので見るのが一番はやいのですが、

```
logger.debug 'hoi'
```

みたいなのは若干サムいかなと思ったので、[ActiveSupport::LogSubscriber](http://api.rubyonrails.org/classes/ActiveSupport/LogSubscriber.html) を使いました。


## 最後に

どうぞご利用ください。
