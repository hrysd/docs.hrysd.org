---
layout: post
title: WSL 上の Debian(Buster) に Neovim をインストールする
date: 2021-12-12 20:30
categories: WSL
---

最近はもっぱら、VSCode に [Vimの拡張](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim) をインストールして満足していたんだけど、Neovim 0.5 あたりから Lua が組み込まれ Lua でスクリプトが書けるとのことで改めて入門した。

- https://neovim.io/news/2021/07

## 環境

- Debian 10 (Buster)

## 準備

Debian のバージョンが stable/oldstable の場合、 neovim のパッケージは新しくても 0.4 系が登録されているので testing のリポジトリを使えるようにしていく。

- https://packages.debian.org/search?keywords=neovim

/etc/apt/sources.list.d に testing のリポジトリを追加する。

```
deb https://deb.debian.org/debian testing main
deb-src https://deb.debian.org/debian testing main
```

意図せずに testing のパッケージを使わないように優先度を指定する。
/etc/apt/preferences.d にファイルを用意する。

- stable

```
Package: *
Pin: release a=stable
Pin-Priority: 900
```

- testing

```
Package: *
Pin: release a=testing
Pin-Priority: 90
```

`Pin-Priority` については以下のドキュメントに詳細がのっている。

- https://manpages.debian.org/bullseye/apt/apt_preferences.5.ja.html

## インストール

ここまで準備できたらアップデートして apt を叩くだけ。

```
$ apt-get -t testing install neovim
```

## 最後に

VSCode は VSCode であって Vim ではないのでという気持ちで改めて入門しよう。
