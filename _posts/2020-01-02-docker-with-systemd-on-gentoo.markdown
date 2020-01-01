---
layout: post
title: Gentoo 上で Docker が動かなくて困っていた
date: 2020-01-02 01:00
categories: Docker
keywords:
  - Docker
  - systemd
---

Gentoo 上で Docker が動かなくて困っていたが、動くようになった話。

## 環境について

関係しそうなパッケージはこれくらい...?

```
| パッケージ                | バージョン |
| ------------------------- | ---------- |
| sys-kernel/gentoo-sources | 4.6        |
| sys-apps/systemd          | 244        |
| app-emulation/docker      | 19.03.5    |
```

## `docker run` 出来ない

`docker run` を実行すると以下のように出力され、コマンドが実行できなくなってた。

```
$ docker run hello-world
docker: Error response from daemon: OCI runtime create failed: container_linux.go:346: starting container
process caused "process_linux.go:297: applying cgroup configuration for process caused \"open /sys/fs/cg
roup/docker/3718192b61bd7541d831846709c3ed4e765f629368843175da70d576b5b1bcf0/cpuset.cpus.effective: no su
ch file or directory\"": unknown.
ERRO[0000] error waiting for container: context canceled 
```

## 解決のきっかけ

昨年末 [@ursm](https://twitter.com/ursm) さんとお会いしたときに、Gentoo 上で Docker が動かなくて〜〜みたいな話をし、その時にアドバイスをもらえた。

が、その時はアルコールが入っていて次の日に思い出せないという別の問題が発生...

## 困ったときの公式 Wiki

断片的な記憶をたよりに関連してそうなパッケージの USEフラグなどを眺めていたんだけど、[Gentoo の Wiki](https://wiki.gentoo.org/wiki/Main_Page) の [Docker](https://wiki.gentoo.org/wiki/Docker#Docker_service_runs_but_fails_to_start_container_.28systemd.29) のページで同じような問題への対処法が言及されていた。

> You will need to add the following line to your kernel boot parameters
> `systemd.unified_cgroup_hierarchy=0`

とのことなので、`make nconfig` から `CONFIG_CMDLINE` を以下のように修正し、カーネルをビルドした。

```
$ cat /usr/src/linux/.config | grep CMDLINE
CONFIG_CMDLINE_BOOL=y
CONFIG_CMDLINE="root=/dev/nvme0n1p3 init=/usr/lib/systemd/systemd systemd.unified_cgroup_hierarchy=0"
```

リブート後、前述のコマンドを実行してみると...

```
$ docker run hello-world

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

🎉 🎉 🎉 🎉 🎉

## 最後に

とりあえず動くようになったアンド困ったときの公式 Wiki という話でした。細かい部分は別途調べてみようと思います。

[@ursm](https://twitter.com/ursm) さん、この場をかりてお礼申し上げます。ありがとうございました。そして忘れてごめんなさい。

（このブログ、マークダウンでテーブル書けないのか...）
