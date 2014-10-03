---
layout: post
title:  'Tmux Plugin Manager を使う'
date:   2014-10-03 17:00:00
categories: tmux
---

tmux のプラグインを `.tmux.conf` で管理できる [tpm(Tmux Plugin Manager)](https://github.com/tmux-plugins/tp://github.com/tmux-plugins/tpm) を使いはいじめてみた。

## Installation

[GitHub のリポジトリ](https://github.com/tmux-plugins/tpm) より clone

```
$ git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

`.tmux.conf` の最下部にインストール/使いたいプラグインを記述

```
# List of plugins
set -g @tpm_plugins "    \
  tmux-plugins/tpm       \
  tmux-plugins/tmux-yank \
"

  run-shell ~/.tmux/plugins/tpm/tpm
```

tmux を起動後、`prefix + I` プラグインのインストール、`prefix +  U` でアップデートができる。

## 最後に

プラグインは [tmux-plugins](https://github.com/tmux-plugins) に多数あり、プラグインを自作用の[ドキュメント](https://github.com/tmux-plugins/tpm/blob/master/HOW_TO_PLUGIN.md)もあった。

なんだかんだいろいろ調べつつも [tmux-yank](https://github.com/tmux-plugins/tmux-yank) しか使ってないのでした。
