---
layout: post
title: Datadog の In-App WAF が動いているか確認する
date: 2023-06-13 00:00
categories: Datadog
---

Datadog の [Application Security Management(ASM)](https://docs.datadoghq.com/security/application_security/) から有効にできる In-App WAF.

実際に導入し怪しいリクエストのブロッキングを有効にしたのはいいが、動いているか確認したいけど変なリクエストを送るのはちょっと...と悩んでいたらやっぱりテスト用のルールがあった。

ドキュメントを検索しても見つけられず、例えば Ruby のクライアントは [v1.12.0](https://github.com/DataDog/dd-trace-rb/releases/tag/v1.12.0) から [Custom Rules](https://docs.datadoghq.com/security/application_security/threats/inapp_waf_rules/#custom-in-app-waf-rules) に対応したっぽいので、自身で定義するか〜とか考えていたが Datadog Recommended policy 内にテスト用のルールがあった。

 - Datadog Recommended policy > Security scanner > Datadog test scanner: user-agent

というのがそれで、User-Agent に特定の文字列指定してあげると動いていることが確認できる。
以下 curl の例で URL は適当。

```
$ curl -H "User-Agent: dd-test-scanner-log" https://example.com
You've been blocked

Sorry, you cannot access this page. Please contact the customer service team.

Security provided by Datadog.
```

## 最後に

Recommended と言いつつもアクセスに制限をかけるものなのだから、ちゃんと適用されるルールをみましょう...
