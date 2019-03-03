---
layout: post
title:  'Homebrew から入れた ImageMagick で rsvg-convert コマンドを使う'
date:   2015-04-10 11:00:00
categories: misc
---

[homebrew](http://brew.sh/) からいれる ImageMagick で `rsvg-convert`。

## 結論

`rsvg-convert` を使用するためには `--with-librsvg` オプションを渡す必要がある。

```
$ brew install imagemagick --with-librsvg
```

## 依存について

XQuartz が入っていないとインストール出来ないので、何かしらの方法で入れる必要がある。

私は dmg をダウンロードした。

```
[hrysd:~]>  brew install imagemagick --with-librsvg

cairo: XQuartz is required to install this formula.
You can install with Homebrew Cask:
  brew install Caskroom/cask/xquartz

You can download from:
  https://xquartz.macosforge.org
  pango: XQuartz is required to install this formula.
  You can install with Homebrew Cask:
    brew install Caskroom/cask/xquartz

You can download from:
  https://xquartz.macosforge.org
  gtk+: XQuartz 2.3.6 is required to install this formula.
  You can install with Homebrew Cask:
    brew install Caskroom/cask/xquartz

You can download from:
  https://xquartz.macosforge.org
  librsvg: XQuartz is required to install this formula.
  You can install with Homebrew Cask:
    brew install Caskroom/cask/xquartz

You can download from:
  https://xquartz.macosforge.org

Error: Unsatisified requirements failed this build.
```
