---
layout: post
title:  'ホームページを更新した'
date:   2021-01-18 00:00
categories: Next.js
---

私の公式ホームページ？でもある [hrysd.org](https://hrysd.org) を更新した。

- https://github.com/hrysd/hrysd.org

## きっかけ

これといった理由もないんだけど、ちょうどその時にやっていたことが行き詰まったので気分転換もかねて更新した。

![hrysd.org](/assets/images/hrysd_org.png)

## なにで？

元々、[Jekyll](https://github.com/jekyll/jekyll) を使って構築していたんだけど（これは [kanda.uno](https://kanda.uno) のコードベースを元にしたから）、今回は Next.js を利用した。

Vue.js に馴染みがあるので Nuxt.js でシュッとと思ったけど、せっかくなので普段使ってない Next.js にした。
公式ページを流し読みすれば簡単（1ページしかないからかも）に生成できて、Lighthouse の結果も良かった。

![lighthouse](/assets/images/lighthouse.png)

## 最後に

なんか工夫したところとか実現するのが大変だったところ！みたいな事を書きたかったけど、強いて言えば SVG を手書きしたのが大変だったかな...

みなさんも暇つぶしとしてホームページを作ってみてはいかがでしょうか。以上。
