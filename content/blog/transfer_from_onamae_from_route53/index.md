---
layout: post
title: 'お名前.com から Amazon Route53 へドメインを移管した'
date: 2016-06-19 09:00:00
categories: AWS
---

このブログのドメインを お名前.com から Amazon Route53 に移管した。

## 事前準備

### AWS アカウント

個人用のアカウントとったままで何もしてなかったので、以下のことをした

- IAM ユーザを作成
  - ルートアカウントで操作しないで済むように、操作用のユーザを準備する。
  - 適当なポリシーを付与したグループを作成し、ユーザを作成・追加した。

- 請求情報を IAM ユーザに解放する
  - デフォルトではルートアカウントでしか確認できないので、アカウントページより有効に。

- 請求額を監視する
  - クラウド破産が怖いので、請求額がある一定の閾値に達したら通知するようにした。
  - このアカウントで使用しているサービスは Route53 だけでアクセス数も少なめなので閾値は 20USD にした。

## ドメイン移管の落とし穴

基本的には[ドキュメント](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/domain-transfer-to-route-53.html)の通りにやった。
特に難しいことはなかったが、whois 公開代行の解除ではまった。
というのも、お名前.com では org ドメインの新規での whois 公開代行自体が出来なくなっていて、すでに whois 代行している場合は解除するのにお問い合わせが必要だった。

## Amazon Route53 の DNS を使用する

いくつかドメインを所持しているんだけど、基本的にそれらの DNS として [Dozens](http://dozens.jp/) を使っている。
せっかく Route53 に移管したので、DNS も変えてみようと思い、[Terraform](http://terraform.io/) を使用してホストゾーンを作成することにした。

```tf
provider "aws" {
  region = "ap-northeast-1"
}

resource "aws_route53_zone" "hrysd-org" {
  name = "hrysd.org"
}

resource "aws_route53_record" "hrysd-org" {
  zone_id = "${aws_route53_zone.hrysd-org.zone_id}"
  name = "hrysd.org"
  type = "A"
  ttl = "300"
  records = ["157.7.238.125"]
}

resource "aws_route53_record" "docs-hrysd-org" {
  zone_id = "${aws_route53_zone.hrysd-org.zone_id}"
  name = "docs.hrysd.org"
  type = "A"
  ttl = "300"
  records = ["157.7.238.125"]
}
```

これを適用後に、ドメインのネームサーバを変更した。

## 最後に

特に移行した強い理由はなかったんだけど、終わってみると AWS が一番サイトの使い心地が良いような気がした。

## 合わせて読みたい

- [アラートと通知で請求額をモニタリング](https://docs.aws.amazon.com/ja_jp/awsaccountbilling/latest/aboutv2/monitor-charges.html)
- [既存ドメインの DNS サービスを Amazon Route 53 に移行する](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/MigratingDNS.html)
- [ドメイン登録の Amazon Route 53 への移管](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/domain-transfer-to-route-53.html)
- [Amazon Route 53 に登録できるドメイン](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/registrar-tld-list.html)
