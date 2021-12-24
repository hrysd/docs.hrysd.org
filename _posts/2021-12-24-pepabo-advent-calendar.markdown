---
layout: post
title: 最近の仕事について、発表 "レガシーWebアプリケーションの性能とコードの健全性をインクリメンタルに改善する" によせて
date: 2021-12-24 21:30
categories: misc
---

これは  [GMOペパボエンジニア Advent Calendar 2021](https://adventar.org/calendars/6375)、24日の記事です。

私が所属してるチームは、[Pepabo Tech Conference #18](https://pepabo.connpass.com/event/231478/) で [kymmt90](https://twitter.com/kymmt90) が発表したように、4Q は [カラーミーショップ](https://shop-pro.jp/) のショップページのパフォーマンス改善に取り組んだ。この記事ではこの取り組みで自身が印象的だったとこなんかを紹介したいとおもいます。

そういえばアドベントカレンダーに記事書くの初めてかもしれない。

## ボトルネックへの対応

あらためてアプリケーションのパフォーマンス改善するにあたり重要だと感じているのは、定常的な観測とアプリケーションの状況を俯瞰できる環境なのかなと思った。
あたりまえだけど、ある一点（タイミング等）での状況では何が問題になっているのか、問題と思しき箇所が本当に問題であるのかというのが明確にしにくい。例えば、ログで見かけた遅かったレスポンタイムとかだと、そもそもサンプルの数として微妙だし、普段は早いんだけどたまたま外部のサーバーが遅延していたみたいな外的要因だと平常時がわからないと遅いのかも判断できないし、アクセスが増え負荷が上がっていたとか平常時の状況との比較が必要になってくる。とりあえず APM を入れる・毎日眺めるのが大事だし、楽だと感じた。

今回対象のアプリケーションでは NewRelic を利用していて、トランザクショントレースとして記録されたトランザクションをひたすら眺めて調査、優先順位を判断して対応していった。どういったトランザクションがトランザクショントレースとして記録されるのかは以下のページが参考になる。

- [トランザクショントレースの概要](https://docs.newrelic.com/docs/apm/transactions/transaction-traces/introduction-transaction-traces/)

> 1分間の収集サイクルで、閾値（Apdex T値の4倍または特定の秒数）に違反するすべてのトランザクションは、トランザクションプールに追加されます。
> New Relicエージェントはその1分間が終わると同時に、プール内で最も遅いトランザクションを選択し、そのトランザクションに対してトランザクショントレースを実行します。


ひたすらにこれを眺めてどこが遅くなっているのか調査・優先順位つけて対応していくと、最終的にトランザクショントレースがなくなるのでここまで来たら別の方法を探す、閾値を変えるといったことをするといいかもしれない。

![empty-trace](/assets/images/empty-trace.png)

APM とは別にアクセスログをからレスポンスタイムの可視化した。ユーザごとに分類できるようにしたり、次のボトルネック探し・改善の結果を確認するのに利用した。BigQuery は[APPROX_QUANTILES](https://cloud.google.com/bigquery/docs/reference/standard-sql/functions-and-operators#approx_quantiles) を使ってパーセンタイルな値をシュッと計算できて便利だった。以下はイメージ。

```sql
SELECT
  url,
  COUNT(*) AS access_count,
  APPROX_QUANTILES(CAST(request_time AS FLOAT64), 1000)[offset(950)] AS p95
FROM access_log
GROUP BY url
ORDER BY p95 DESC
```

### 参考

- [Transaction traces: Trace details page](https://docs.newrelic.com/docs/apm/transactions/transaction-traces/transaction-traces-trace-details-page/)
  - NewRelic のトランザクションについてはこのあたりも参考になる

## E2E テスト

今回の対象のアプリケーションはそもそものテスト量も少なく、実際にボトルネックを直す際に修正箇所に対してテストを追加しずらかった。目視で問題ないことを確認するのは当然のこと、今後とも継続してアプリケーションを改善していくことを考えて E2E テストを追加することにした。

個人的には E2E テストは落ちやすい・遅い・メンテナンスが面倒だったりという感覚だけど、テストをしづらい・書きづらい部分を表面的に検証できる方法としてはベターな手段だと思う。ページ全てに対して、スモークテストみたいなのも書けるだろうし（今回はしていないけど...）

静的解析・ユニットテスト・E2E テストと多面的に検証した方が安心もできるし、保守性も維持できるんじゃないかと思う。これは俗に言われるレガシーアプリケーションに限った話ではないけども。

実際には最低限これが通れば安心できるみたいなケースを用意し GitHub Actions でワークフローっぽいものを組んで検証環境へのデプロイ後に E2E テストを実行するようにした。

- アプリケーションのリポジトリ

```yml
name: E2E を動かす

on:
  workflow_run:
    workflows: [deploy]
    branches: [main]
    types: [completed]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v5
        if: ${{ github.event.workflow_run.conclusion == 'success' }}
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: github.rest.actions.createWorkflowDispatch(OWNER, REPOSITORY, 'test.yml', 'main')
```


- E2E テストのリポジトリ

```yml
name: テストを実行

on:
   workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: bin/test # テストの実行
```

### 参考

- [Events that trigger workflows](https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows)

## 最後に

この記事に書いていないことも色々と対応し、発表で紹介されていたように結果的にはレスポンスタイムも早くなり、 稼働率も上がったのでそこそこいい感じになったのではないだろうかという気分。
モニタリングとテストで大体良くなる！を標語に今後は生きていこうかな。

本題とは関係ないが、何がレガシーと言われてしまう所以なのかを考えると対応案も出てくるのかもしれないと思った。
