---
layout: post
title: "Windows 10 のライセンスを買った"
date: 2020-12-09 01:00
categories: Windows
---

以前から試してみたい気持ちがあり、Gentoo Linux を入れて使っていた x280 の emerge 業が溜まり解消するのも大変そうだったので Windows をインストールした。

この記事は Windows をインストールし、記事を書けるようになるまでの記録。

## 買ったもの

パッケージ版の [Windows 10 Home](https://www.amazon.co.jp/dp/B07WGM2Y61) を購入した。特に何も調べずに買ったので Pro との違いは分かっていない。

## この記事を書くのにした準備

このブログは Jekyll を使い作られているので実質 Ruby が動くようになるところまでという感じ。

### インストールしたアプリケーション

- [Firefox](https://www.mozilla.org/ja/firefox/)
  - とりあえずブラウザ。Edge がデフォルトで入っていたけどとりあえず
- [1Password](https://1password.com/jp/)
  - ノーコメント
- [Windows Terminal](https://github.com/microsoft/terminal)
  - README にあるように [Microsoft Store](https://www.microsoft.com/ja-jp/store/apps/windows) からインストール
- [Visual Studio Code](https://code.visualstudio.com/)
  - UserInstaller というのを利用した
- [Windows PowerToys](https://github.com/microsoft/PowerToys)
  - キーの割り当てをいじることができそうなのでインストール
    - CapsLock -> Ctrl
  - ランチャーっぽいアプリがおまけでついてきた
    - Ctrl + Space で起動するようにした

### WSL

Windows を使ってみたい理由でもあった WSL。
何もわからないのでとりあえず公式の手順の通りに実行した。
以下の手順はただのメモなので真似はせずに公式のドキュメントを見てね。

- https://docs.microsoft.com/ja-jp/windows/wsl/install-win10

スタートメニュー？から PowerShell を管理者権限で起動、以下のコマンド実行後に再起動。

```
> dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
> dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

Step4 の通りにファイルをダウンロードし、実行。再度 PowerShell を開き以下のコマンドを実行する。

```
> wsl --set-default-version 2
```

次に WSL で使いたいディストリビューションを選択。
[Debian](https://www.microsoft.com/ja-jp/p/debian/9msvkqc78pk6?rtc=1&activetab=pivot:overviewtab) があったのでこれに決定。

起動後ユーザー名とパスワードを設定しておしまい。

### Windows Terminal の設定

ひとまず、ターミナル起動時は常にDebianであってほしかったので以下の設定をした。
色とかは後回し。

- `defaultProfile` を Debian
- 起動時のディレクトリをホームに
  - `"startingDirectory": "//wsl$/Debian/home/hrysd"`

### 開発環境の用意

ここからは普通？の Linux なので特に悩まず進めた。

```
$ sudo apt-get update
$ sudo apt-get install build-essential git zsh wget gnupg tmux curl unzip
$ ssh-keygen -t ed25519 # GitHub 用に新しい鍵を作成
$ ssh -T git@github.com # 疎通確認

# rcm を用意 https://github.com/thoughtbot/rcm
$ wget -qO - https://apt.thoughtbot.com/thoughtbot.gpg.key | sudo apt-key add -
$ echo "deb https://apt.thoughtbot.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/thoughtbot.list
$ sudo apt-get update
$ sudo apt-get install rcm

# config を持ってくる
$ mkdir -p src/github.com/hrysd
$ cd src/github.com/hrysd
$ git clone git@github.com:hrysd/config.git
$ RCRC=dotfiles/rcrc rcup -v

# ディレクトリごとにコミットのメールアドレスを分けているので
$ src/github.com/.gitconfig

# asdf を入れる https://github.com/asdf-vm/asdf
$ git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.8.0
$ asdf plugin add ghq
$ asdf global ghq VERSION

$ asdf plugin add ruby
# https://github.com/rbenv/ruby-build/wiki
$ sudo apt-get install autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm6 libgdbm-dev libdb-dev
$ asdf install ruby 2.7.2
```

まだ細かい設定で出来ていないとこはあるけどひとまずはこれで満足。
この後は VSCode で WSL 内のファイルいじったり～みたいなのを試したい。

## 最後に

Windows を使うのはほぼ初めてで、Ctrl中心の生活、入力切替なんかあたりにまだ慣れていない。
これは時間の問題だろうしブログの更新程度ならすんなり出来たのでこれからもしばらく Windows で開発はやっていけそう。ライセンスも高かったし...
