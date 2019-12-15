---
layout: post
title:  'OS X El Capitan をクリーンインストール'
date:   2015-10-18 17:00
categories: Mac
keywords:
  - El Capitan
  - Mac
  - OS X
---

[El Capitan](http://www.apple.com/jp/osx/) が出てしばらく経ったのでクリーンインストールした。

## リリース版を入れる

元々[Public Beta版](https://beta.apple.com/sp/ja/betaprogram/)を入れていて、そこからリリース版のOSを入れる方法がわからずに手間取った。リリース版をいれるにはベータ版利用登録を解除する必要があるようで、以下のリンクを参考に登録解除した。

[登録解除 - Apple Beta Software Program](https://beta.apple.com/sp/ja/betaprogram/unenroll?locale=ja)

登録解除後は、Yosemite 同様に `Command+r` を押しながら起動、Disk Utility.app でディスクを空にしてOSのインストール。
これで問題なくリリース版のインストールできたので、事前にEl Capitanをダウンロードする必要はないっぽい...?(未確認)

## 開発環境の構築

今回は、[Idobata](https://idobata.io) の [Electron版](https://github.com/hrysd/idobata-electron) をいじくりたかったので Node.js の環境を整えるところまで。

**Xcode:**

何はともあれXcode。AppStore より Xcode を入れ、Terminalより Command Line Tools を入れる。

```
$ xcode-select ―-install
```

**Homebrew:**

Xcode の次は [Homebrew](http://brew.sh/index_ja.html)。
El Capitan より Homebrew がインストール先に指定する `/usr/local` が云々という記事を見たので、今回からインストール先を`$HOME`にしてみた。
加えて、諸事情でマルチユーザな環境を使用ないといけない場合でも `$HOME` だと影響を受けにくいと思う。
ただ、`/usr/local` 以外にインストールする事自体オススメされていなようだけど気にしない。壊れたらクリーンインストールしましょう！

- [El Capitan & Homebrew](https://github.com/Homebrew/homebrew/blob/master/share/doc/homebrew/El_Capitan_and_Homebrew.md#if-usrlocal-does-not-exist)
- [HomebrewはEl Capitanへアップグレードする前に入れておく](http://qiita.com/riocampos/items/525ec4b35744ad586c5a)

以下、[リンク先](https://github.com/Homebrew/homebrew/blob/master/share/doc/homebrew/Installation.md#alternative-installs)のコマンドを拝借

```
$ mkdir homebrew && curl -L https://github.com/Homebrew/homebrew/tarball/master | tar xz --strip 1 -C homebrew
$ export PATH=$HOME/homebrew/bin:$PATH
```

**Homebrew Cask**

GUIを持ったアプリケーション向けに [Homebrew Cask](http://caskroom.io) を入れる。
Homebrew Cask はインストールするアプリケーションを Homebrew とは異なり、`/opt/homebrew-cask/Caskroom` に入れる。
前述の Homebrew 同様に`$HOME`以下にインストールするように指定した。
これは、環境変数でオプションを永続化する事ができる。([参考](https://github.com/caskroom/homebrew-cask/blob/master/USAGE.md#options))

```
$ mkdir -p homebrew-cask/Caskroom
$ export HOMEBREW_CASK_OPTS=--binarydir=$HOME/bin --caskroom=$HOME/homebrew-cask/Caskroom
$ brew install caskroom/cask/brew-cask
```

**細かいもの:**

クリーンインストールは気持ちいだけでなくて、今までの環境を見直すのにも便利なので極度な自動化はしていない。
正直めんどくさいけれども、手で入れる。
[dotfile](https://github.com/hrysd/config) の配置は [thoughtbot/rcm](https://github.com/thoughtbot/rcm) を用いて自動化している。

以下 Homebrew で入れたもの。

- zsh
  - これの`rc`ファイルしか用意してない...
  - `/etc/shells` に ````brew --prefix`/bin/zsh``` を追加
  - `chsh -s `brew --prefix`/bin/zsh`
- tmux
  - screen より名前かっこいいし、Terminal.app のタブは使いづらい
- git
  - Command Line Tools か何かで入るんだけど Homebrew の方を使う
  - 合わせて diff-highlight を使用できるようにパスの通った場所にシンボリックリンクを貼っておく
  - ```ln -s `brew --prefix`/share/git-core/contrib/diff-highlight/diff-highlight ~/bin```
  - [Git の diff を美しく表示するために必要なたった 1 つの設定 #git](http://motemen.hatenablog.com/entry/2013/11/26/Git_の_diff_を美しく表示するために必要なたった_1_つの設)

**Node.js:**

Node.js は [hokaccha/nodebrew](https://github.com/hokaccha/nodebrew) で入れる。特に何も考えずにREADMEの通りコマンドを叩く。
nodebrew は `stable` とかのエリアスがあって便利。後、バイナリは甘え。

```
$ curl -L git.io/nodebrew | perl - setup
$ export PATH=$HOME/.nodebrew/current/bin:$PATH
$ nodebrew install-binary stable
```

## 最後に

[去年の今日に Yosemite をクリーンインストールしていた](http://diary.yoshida.dev/2014/10/18/clean_install_osx_yosemite/)ようなので、今日はインストールDay
