---
layout: post
title: Gmail 宛のメールを Discord に通知する
date: 2020-04-06 01:00
categories: diary
---

みなさんメール読んでますか。メールって大量にに送られてくるし、メールアドレスも複数あったりという状況で私は見る気力すら失いました。メールマガジンとかだいぶ整理して、量を減らす努力はしているとアピールだけしておきます。

ある程度やって諦めたので別の方法でメールを気付けるような方法を考えたというのがこのエントリのきっかけです。

## 私的通知基盤

私的通知基盤として Discord に個人のサーバーを作りなんでもかんでもそこに投げ込んでます。

RSS とか特定のサービスのツイート等々。モバイルアプリに通知がくるのでとりあえず気付けるのが良い（他でもできるのはおいといて...）
なので、メールが来たときのアクションとして Discord のサーバー宛にメッセージを送ることにする。

## お知らせする方法

メールを Discord に送るとして、GMail だし Google Apps Script かな？とか "GMail パース" みたいなフレーズで検索した結果、[Zapier](https://zapier.com/home) と [Email Parser by Zapier ]([https://parser.zapier.com/](https://parser.zapier.com/)) の組み合わせでできた。

とりあえずなので、三井住友 VISA カードのご利用通知を送ることにする。
（在宅勤務の体制になり、自宅の労働環境を整えようとここぞとばかりにクレジットカードを使っていて、ご利用明細ラッシュが続いているので...）

### 1. 三井住友カードのサイトからご利用明細通知を有効にする

どえらい機能があるもんだ...

[https://www.smbc-card.com/mem/service/sec/selfcontrol/usage_notice.jsp](https://www.smbc-card.com/mem/service/sec/selfcontrol/usage_notice.jsp)

### 2. Email Parser by Zapier でメールアドレスを発行する

メールの内容からをマウスで抜き出したい部分を指定できてめっちゃ便利だった...

![email_parser_by_zapier.png](/assets/images/email_parser_by_zapier.png)

ここで一つ問題があったんだけど、iD を利用した再のメールの内容が通常の利用時と異なっていて作成したテンプレートでは金額が抜き出せなかったが、下記のページを参考に解決できた。すごい...

- [How to Train Your Email Parser](https://zapier.com/blog/updates/471/how-train-your-email-parser)

### 3. 作ったメールアドレスに Gamil からメールを転送する

検索条件は以下のような感じにした。iD を使った時の明細メールのタイトルが違うので `subject` を複数指定している。

```
from:(statement@vpass.ne.jp) (subject:(ご利用のお知らせ) OR subject:(ご利用明細のお知らせ))
```

### 結果

あとは、Zapier 上でポチポチ連携し、クレジットカードを使うと...

![discord.png](/assets/images/discord.png)

💸💸💸💸💸💸💸💸💸💸💸💸💸

以下余談。

他サーバーのメッセージを流しているチャネルと Zapier を連携したかったんど、送れなかったので新規にチャネルを作った。そういうチャネルに連携したくて上手く連携できない人は確認してみるとよいかも...（これが原因なのかはよくわかってない...）

## 問題点

[Free プランの上位が $19]([https://zapier.com/pricing](https://zapier.com/pricing))くらいと結構お高いのでどうしようかと考えている...

## 最後に

多分今回みたいなお金の話なら [Money Forward ME](https://moneyforward.com/) と連携してそこから見るのが一番楽なんじゃないかな...
資産の合計とかも出てくるし...
