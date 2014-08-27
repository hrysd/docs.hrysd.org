---
layout: post
title:  'Sass Shorthand'
date:   2014-08-25 01:52:00
categories: sass
---

Sass のショートハンド

## Mixin

```sass
@mixin black-border
  border: 1px solid black

=black-border
  border: 1px solid black

header
  @include black-border

header
  +black-border
```

## 最後に

特になし
