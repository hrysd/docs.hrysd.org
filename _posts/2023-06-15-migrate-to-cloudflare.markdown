---
layout: post
title: このブログを Cloudflare Pages に移行した
date: 2023-06-15 23:00
categories: Cloudflare
---

このブログを Netlify から Cloudflare に移行した。

## 流れ

基本的に[移行ガイド](https://developers.cloudflare.com/pages/migrations/migrating-from-netlify/)があるのでそれを参考に GitHub と連携、ビルドの設定を行なった。サイトのビルド設定にプレセットがあって便利。

![cloudflare-pages.png](/assets/images/cloudflare-pages.png)

ここまでで`example.pages.dev` でサイトの確認ができるようになったので次にドメインをあてる。
ドメインは、Terraform を使って Route53 で管理しているので、CNAME レコードの向き先を変更して終わり。

```
resource "aws_route53_zone" "hrysd-org" {
  name = "hrysd.org"
}

resource "aws_route53_record" "docs-hrysd-org" {
  zone_id = aws_route53_zone.hrysd-org.zone_id
  name = "docs.hrysd.org"
  type = "CNAME"
  ttl = "300"
  records = ["docs-hrysd-org.pages.dev"]
}
```

反映までに1~2分くらいかかったようで、瞬断しているタイミングがあった。

## 最後に

移行自体特に難しいことはなかったが、ビルドのログを見る限り Ruby のバージョンが 2.7 系と古かった。
この辺がどうなっているかは今調べ中。

```
19:31:01.954	Using /opt/buildhome/.rvm/gems/ruby-2.7.1
19:31:02.596	Using bundler version 2.2.22 from Gemfile.lock
```

