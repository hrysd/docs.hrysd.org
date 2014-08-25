---
layout: post
title:  'Hi, Jekyll!'
date:   2014-07-07 00:55:50
categories: jekyll
---

Jekyll を使ってみたので調べたこと流れをメモした。

## ビルドするまで

```
$ mkdir static_site && cd static_site
$ bundle init
$ vim Gemfile # Gemfile に jekyll を追加

$ bundle install
$ bundle exec jekyll new . --force
```

`_config.yml` でビルドの対象として含みたくないファイル、ディレクトリを指定することができる。

```yaml
exclude:
  - Gemfile
  - Gemfile.lock
  - vendor
```

そしてビルド。
`_site` 以下にファイルが生成されているのが確認できる。

```
$ bundle exec jekyll build # or serve
```

## Syntax Highlight に rouge を使う

- Gemfile

```ruby
gem 'rouge'
```

```yaml
highlighter: rouge
```

rouge 以下のコマンドで CSS を吐き出してくれるのでデザインにはそれを使った。
いくつかテーマがあるのでそこから選べる。ちなみに私は `base16` というテーマを選択した。

```
bundle exec rougify THEME_NAME
```

## Markdown の parser として redcarpet を使う

```yaml
markdown: redcarpet

redcarpet:
  extensions:
    - fenced_code_blocks
    - autolink
```

## Assets Pipeline を使う

gem `jekyll-assets` を使用する。

- `_config.yml`

```yaml
gems:
  - jekyll-assets
```

デフォルトで `_assets` のディレクトを見る模様。

## Read more

liquid  の truncate を使用し、本文を少しだけ出す。

```html
{ { post.content | truncate: 300 } }

<a href='{{ post.url }}'>read more</a>
```

## 最後に

ちょっと調べたけど、結局面倒になって使わなかった機能が多々ある...
