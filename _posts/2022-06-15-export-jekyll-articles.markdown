---
layout: post
title: Jekyll で作られたブログの記事を JSON に変換する
date: 2022-06-14 00:00
categories: jekyll
---

## なにこれ

少し前からブログを Jamstack なものに変えたいと考えていたんだけど、このブログは Jekyll で出来ていて、基本的に記事は Markdown のファイルベース。これでは記事はインポートとか取り回しが悪いので JSON に変換するスクリプトを書いてみた。

```rb
require 'jekyll'

site = Jekyll::Site.new(Jekyll.configuration)

articles = Dir.glob('./_posts/*').map {|post|
  document = Jekyll::Document.new(post, site: site, collection: Jekyll::Collection.new(site, 'post'))
  document.read

  {
    title:      document.data['title'],
    slug:       document.data['slug'],
    body:       document.content,
    created_at: document.date,
    updated_at: document.date
  }
}

File.open('articles.json', 'w') do |f|
  f.write JSON.dump(articles)
end
```

## 最後に

ひとまず記事を変換できるようにはなったので次はどこで記事を管理するか考える
