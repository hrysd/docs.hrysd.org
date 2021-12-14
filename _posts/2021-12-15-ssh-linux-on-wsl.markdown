---
layout: post
title: WSL で動く Linux へ SSH する
date: 2021-12-15 00:30
categories: WSL
---

[この時](https://docs.hrysd.org/2021/02/22/home-built-pc/)に自作したパソコンでは Windows が動いていて、そこそこのスペックなので便利に使っているんだけど、デスクトップなので物理的に動かして使えない。
例えば、寝転びながらパソコンをするみたいなことができなくて困っていた。自宅の LAN 内でリモートアクセスできれば解決するのでは？ということで調べた。

## WSL 側の準備

OpenSSH のサーバーをインストールし、鍵を配置する。
こういう時に GitHub に公開鍵あって便利〜という気持ちになる。

```
$ apt-get install openssh-server
$ sudo service ssh start
$ curl https://github.com/hrysd.keys > ~/.ssh/authorized_keys
```

## ホスト側の準備

ホスト側、Windows 側で PowerShell で設定していく。

```
# WSL で動いてる Linux の IP アドレスを取得

> wsl -d Debian -e hostname -I

# ファイアウォールの設定を作る。DisplayName は適当

> New-NetFireWallRule -DisplayName 'WSL 2 SSH' -Direction Inbound -LocalPort 22 -Action Allow -Protocol TCP
> New-NetFireWallRule -DisplayName 'WSL 2 SSH' -Direction Outbound -LocalPort 22 -Action Allow -Protocol TCP

# ホスト側に来たアクセスを WSL へプロキシする

> Start-Process -Verb runas netsh.exe -ArgumentList "interface portproxy add v4tov4 listenport=22 connectaddress=172.30.227.83"

# 設定の確認

>  netsh.exe interface portproxy show v4tov4

ipv4 をリッスンする:         ipv4 に接続する:

Address         Port        Address         Port
--------------- ----------  --------------- ----------
*               22          172.30.227.83   22
```

あとは手元のラップトップ等から LAN 内での IP なんかに SSH するだけ。
私の Windows 端末は IP 固定とかしていないので PowerShell でコマンド叩いて取得した。
（デスクトップマシンなのに Wi-Fi なのは終端装置の場所の都合です...)

```
# インターフェイスが Wifi の IPv4 のアドレスを取得
> Get-NetIPAddress -InterfaceAlias Wi-Fi -AddressFamily IPv4 | Select IPAddress -ExpandProperty IPAddress
```

PowerShell で設定したファイアウォールは "セキュリティ強化された Windows Defender ファイアウォール" というアプリで確認・修正もできる。

## 最後に

ひとまず WSL に SSH できるようになったので満足。他のポートも設定すれば、例えば WSL で動かしているアプリケーションなんかにもアクセスできると思うし、結構便利なのではという気持ちになった。
WSL の IP も変わったりするのでそのあたりの対応だったり、スクリプト化して常用に耐えられるものにしたい。
