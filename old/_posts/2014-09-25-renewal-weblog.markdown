---
layout: post
title:  'ブログ移行してました'
date:   2014-09-25 00:10:00
categories: misc
---

ブログを [Jekyll](https://github.com/jekyll/jekyll) で新たに作り、ドメインを変更しました。

リポジトリは[こちら](https://github.com/hrysd/docs.hrysd.org)。

## なぜ Jekyll

- 名前が [middleman](https://github.com/middleman/middleman) よりかっこいい

- 静的サイトは設置が楽
  - Nginx をたてて、適当にファイル転送するだけなのですごく楽
  - Nginx は、[これ](https://github.com/hrysd/vps) を使ってプロビジョニング的なことしてみた
  - プッシュしてない部分とかあるから近々まとめたい

- ファイルベースだから、記事を書くと GitHub に草が生える

## URL について

前から [@komagata さんのブログ](http://docs.komagata.org) の URL が格好いいと思っていて、今回真似をしました。

ドメイン自体は お名前.com で取っていて、DNSは [Dozens](https://dozens.jp) を使用しています。(お名前.com の ４つに別れた IP 入力フォームがつらい)

![onamae](/assets/images/onamae_form.png)

## TODO 的な

- 自動デプロイしたい
  - 現時点では、手で `scp` してる...

## 最後に

なんだかんだ書きつつも、いずれは静的サイトやめたい。
