---
layout: post
title: Kinesis Advantage のキーマップのいじり方忘れがち
date: 2020-03-05 20:00
categories: diary
---

自宅に説明書はあるんだけど、それを出すのも面倒で年に数回ググっている気がする。のでここにも書く。

そんなにキーマップいじるの？という話ではあるが、ふとした時に設定をリセットしたくなることはあるはず。

## キーマップの初期化

`Program + F10 + Shift`

## 端末ごとのデフォルト設定を使う

利用する端末ごとにデフォルトの設定があるのでそれを使う。

ただ、私は MacOS の初期設定をベースに Linux でも利用しているので、`= + m` でおしまい。

これをやる時にリマップ等の時に使う別のキー（`Program`等）を押す必要はない。これを忘れてパニックになる。

## 音を消す

電子音がいらなくいくらい心地よい音がするので、キーボードを叩いた時の電子音は消す。

`Program + \`

## 個人的な設定

ここからは個人的設定。

`Program + F12` をおしてリマップを開始。

- CapsLock を ESC
- Delete を Ctrl

にして 終わり。最終的にこうなる。

![kinesis_advantage_keymaps](/assets/images/kinesis_advantage_keymaps.png)


上の画像は [QMK Configurator](https://config.qmk.fm/#/) から撮影してきた。

## 最後に

Kinesis 便利。
