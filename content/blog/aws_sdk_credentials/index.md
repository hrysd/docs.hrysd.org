---
layout: post
title: 'aws-sdk-ruby でのクレデンシャルの扱い'
date: 2016-04-25 23:00:00
categories: AWS
---

EC2 で稼働する Rails アプリケーション上で [aws-sdk-ruby](https://github.com/aws/aws-sdk-ruby) にクレデンシャル情報を渡す話。

## バージョン

`aws-sdk-ruby (2.2.33)`

## クレデンシャルの設定には優劣がある

aws-sdk は暗黙的に以下の順序でクレデンシャル情報を探索する。

- static\_credentials
  - 直接設定された値

- env\_credentials
  - 環境変数
  - [参考](https://github.com/aws/aws-sdk-ruby/blob/master/aws-sdk-core/lib/aws-sdk-core/credential_provider_chain.rb#L44)

- shared\_credentials
  - `$HOME/.aws/credentials` に INI形式で記述されるもの
    - 上記のパスはデフォルトなだけでカスタマイズ可能な実装に見えるけど、できなそうな実装になっている([参考](https://github.com/aws/aws-sdk-ruby/blob/master/aws-sdk-core/lib/aws-sdk-core/credential_provider_chain.rb#L62))
  - `[default]` セクションが優先使用される
    - これもカスタマイズ可能
    - 環境変数 `AWS_PROFILE` もしくは設定から指定ができる

- instance\_profile\_credentials
  - EC2 インスタンスに割り当てた IAM ロールからクレデンシャル情報を取得する
  - [参考](http://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/ec2-instance-metadata.html)

## 実際にアプリケーションに対してクレデンシャル情報をどう渡すか

ステージング、プロダクションといった AWS 上で動くアプリケーションに関しては
上記4番目の instance\_profile\_credentials を利用すればよさそう。

なので

- 開発環境（ローカル）
  - 各自のアカウントでトークンを発行
  - `$HOME/.aws/credentials` に記載

- ステージング、プロダクション(EC2上で稼働するもの)
  - インスタンスに対してアクセス権を付与

という感じで、アプリケーションコードに対するクレデンシャルの記載を最小限にできたつもり。

## 悩み事

ただ、開発環境で AWS の API を叩きたい時なんかのために

- `$HOME/.aws/credentials`

```
[hogehoge-development]
  aws_access_key_id = AWS_ACCESS_KEY_ID
  aws_secret_access_key = AWS_SECRET_ACCESS_KEY
```

- `config/initializers/aws\_sdk.rb`

```ruby
if Rails.env.development?
  Aws.config[:profile_name] = 'hogehoge-development'
end
```

ってしたけど、いい方法無いかな...
