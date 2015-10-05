---
layout: post
title:  'DockerでHerokuでRustが動いたぞ!!!'
date:   2015-05-11 18:00
categories: rust
keywords:
  - Heroku
  - Rust
  - Docker
---

Dockerを使ってHerokuにRustのアプリケーションをデプロイしてみた。

リポジトリ: [hrysd/rust-on-heroku-with-docker](https://github.com/hrysd/rust-on-heroku-with-docker)

## デプロイするまで

`heroku docker:init` で生成される `Dockerfile` を元に、いろいろと参考にして書いてみた。

アプリケーションのコード自体は [hyperium/hyper](https://github.com/hyperium/hyper) の example をちょっといじったもの。

## 困ったこと

当初 OSX でビルドしたバイナリを Docker に入れて動かそうとしたんだけど、当然の如く実行できない。
そのため、コンテナ内に Rust をインストールしてコンテナ内でアプリケーションのバイナリをビルドするようにした。

ただ、`cargo build` には `--target` オプションがあるようで、もしかしたらこれでクロスコンパイルできる...?

```
Compile a local package and all of its dependencies

Usage:
    cargo build [options]

Options:
    -h, --help               Print this message
    -p SPEC, --package SPEC  Package to build
    -j N, --jobs N           The number of jobs to run in parallel
    --lib                    Build only lib (if present in package)
    --release                Build artifacts in release mode, with optimizations
    --features FEATURES      Space-separated list of features to also build
    --no-default-features    Do not build the `default` feature
    --target TRIPLE          Build for the target triple <= これ!!
    --manifest-path PATH     Path to the manifest to compile
    -v, --verbose            Use verbose output
```

## 結果

最終的に `Dockerfile` は以下のような感じになった。

```
FROM heroku/cedar:14

RUN useradd -d /app -m app

WORKDIR /app

ENV PORT 3000
ENV SHELL /bin/sh

RUN curl -s https://static.rust-lang.org/rustup.sh | sh -s -- --disable-sudo --channel=nightly -y

USER app

RUN mkdir -p /app/src
RUN mkdir -p /app/.profile.d

ONBUILD COPY . /app/src/

USER root

WORKDIR /app/src

ONBUILD RUN cargo build -v --release

ONBUILD EXPOSE 3000
```

## 最後に

DockerもRustも詳しくないのでてんやわんやしたけど、軽く入門できてよかった。
Rust を動かす環境でお悩みの際は試していただけると!!

## 合わせて読みたい

- [DockerでHerokuでPerlが動いたぞ!!!](http://hitode909.hatenablog.com/entry/2015/05/07/200611)
- [DockerでHerokuでmrubyが動いたぞ!!1](http://blog.kentarok.org/entry/2015/05/08/004452)
- [Herokuの'docker:release'の動き](http://deeeet.com/writing/2015/05/07/heroku-docker/)
- [Introducing 'heroku docker:release': Build & Deploy Heroku Apps with Docker](https://blog.heroku.com/archives/2015/5/5/introducing_heroku_docker_release_build_deploy_heroku_apps_with_docker)
