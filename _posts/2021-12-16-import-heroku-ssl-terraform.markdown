---
layout: post
title: Heroku 上のアプリケーションを Terraform で管理する時の Tips
date: 2021-12-16 23:30
categories: Terraform
---

Heroku アプリケーションが大量にある場合、証明書の更新だったりアドオンの付け替え等画面ポチポチ作業が多く更新自体が正しいのかとか気にかける必要がある。実際に本番で稼働していたりした場合、管理画面での操作が間違っていないのかとか緊張感がでる作業にもなりがち。実際に多数の Heroku アプリケーションに対して、Terraform の管理下において行った時の Tips を紹介する。

## アドオンをインポートする

基本的に `heroku` コマンドを利用することでアプリケーションの情報は取れる。なので、それと [jq](https://stedolan.github.io/jq/) を駆使してインポートしていく。

- plan 名を調べ、resource を定義

```
$ heroku addons --json --app APPLICATION_NAME | jq '.[] | select(.plan.description == "Deploy Hooks HTTP Post Hook") | .plan.name' # deployhooks:http がとれる
```

- アドオンを定義する、アプリ自体はすでに管理している想定

```
resource "heroku_addon" "deploy_hook" {
  app = heroku_app.HEROKU_APP_RESOURCE.name
  plan = "deployhooks:http"
}
```

- id を調べ、インポート

```
$ heroku addons --json --app APPLICATION_NAME | jq '.[] | select(.plan.description == "Deploy Hooks HTTP Post Hook") | .plan.id'
```

```
$ terraform import heroku_addon.deploy_hook ID # <- 上のコマンドの結果
```

以上。管理画面から ID 周りとかパッと見つけづらいので heroku コマンドを利用するのが良い。

## Heroku SSL リソースのインポート

Heroku ACM でなく、独自の証明書なんかを利用している場合なんか、Heroku SSL を Terraform で管理しておくと証明書の更新作業が楽になる。これ、 `heroku_ssl` をインポートする場合に証明書の ID が必要なので、`curl` で Heroku の API を叩いてあげる。

```
$ curl -n -X GET https://api.heroku.com/apps/APP_NAME/sni-endpoints \
-H "Accept: application/vnd.heroku+json; version=3" |  jq '.[] | select(.ssl_cert.acm == false)
```

インポート自体は下記のドキュメントを見るとよい。

- https://registry.terraform.io/providers/heroku/heroku/latest/docs/resources/ssl


## 最後に

Heorku のアプリケーションは管理画面からでも簡単に管理することができるが、Terraform を介することでここで取り上げたアドオンの削除・更新であったり、環境変数の編集がコードとして残るので GitHub でレビューなんてこともできたり、現時点の状況が把握しやすくなる利点が十分あると思う。
なので、多少ややこしくはなるけどたくさんの Heroku アプリがあって〜という場合に限らず Terraform を利用する利点はあるんじゃないかな。

ちなみに、[terraformer](https://github.com/GoogleCloudPlatform/terraformer) での一括インポートはアプリの絞り込みができなたかったりするから私の用途にあってなくて全部手動でインポートしたのであった...
