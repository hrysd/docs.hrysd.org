---
layout: post
title: Svelte なアプリケーションを Cloudflare にデプロイする
date: 2023-06-16 23:00
categories: Cloudflare
---

Svelte(SvelteKit) なアプリケーションを Cloudflare にデプロイしてみた。

## ハマり

### adapter の選択

SvelteKit アプリのデプロイにはデプロイ先向けの adapter が必要になる。

- [Adapters](https://kit.svelte.jp/docs/adapters)

ドキュメントを見る限り、Cloudflare 向けの adapter はいくつかある。
今回のアプリは静的なページのみだったため `@sveltejs/adapter-static` を選択した。
adapter によってデプロイ時の成果物の出力先等が変わるので Cloudflare 側のフレームワークプリセットの内容から変更する必要があった。

![](/assets/images/cloudflare_build_settings.png)

- [参考](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-site/)

### Node.js のバージョンが古い

ビルド環境の Node.js のバージョンが古くデプロイに失敗した。

```
16:42:13.952	Success: Finished cloning repository files
16:42:14.564	Installing dependencies
16:42:14.573	Python version set to 2.7
16:42:17.900	v12.18.0 is already installed.
16:42:19.068	Now using node v12.18.0 (npm v6.14.4)
16:42:19.265	Started restoring cached build plugins
16:42:19.281	Finished restoring cached build plugins
16:42:19.722	Attempting ruby version 2.7.1, read from environment
16:42:21.281	Using /opt/buildhome/.rvm/gems/ruby-2.7.1
16:42:22.277	Using PHP version 5.6
16:42:22.368	5.2.5 is already installed.
16:42:22.385	Using Swift version 5.2.5
16:42:22.385	Started restoring cached node modules
16:42:22.398	Finished restoring cached node modules
16:42:22.729	Installing NPM modules using NPM version 6.14.4
16:42:24.486	npm WARN read-shrinkwrap This version of npm is compatible with lockfileVersion@1, but package-lock.json was generated for lockfileVersion@3. I'll try to do my best with it!
16:42:29.218	npm ERR! code ENOTSUP
16:42:29.219	npm ERR! notsup Unsupported engine for sass@1.63.4: wanted: {"node":">=14.0.0"} (current: {"node":"12.18.0","npm":"6.14.4"})
16:42:29.219	npm ERR! notsup Not compatible with your version of node/npm: sass@1.63.4
16:42:29.219	npm ERR! notsup Not compatible with your version of node/npm: sass@1.63.4
16:42:29.220	npm ERR! notsup Required: {"node":">=14.0.0"}
16:42:29.220	npm ERR! notsup Actual:   {"npm":"6.14.4","node":"12.18.0"}
16:42:29.227	
16:42:29.227	npm ERR! A complete log of this run can be found in:
16:42:29.227	npm ERR!     /opt/buildhome/.npm/_logs/2023-06-18T07_42_29_222Z-debug.log
16:42:29.244	Error during NPM install
16:42:29.250	Failed: build command exited with code: 1
16:42:29.938	Failed: error occurred while running build command
```

どうやら [v2(beta) な環境がある](https://developers.cloudflare.com/pages/platform/language-support-and-tools/)らしく設定ページから切り替えることで Node.js 18系を利用するようになった。

![cloudflare_nodejs_build_environment](/assets/images/cloudflare_nodejs_build_environment.png)

## 最後に

簡単なアプリケーションを Cloudflare にデプロイしてみた。
シンプルなアプリならドキュメントが充実しているのでシュッと扱えて気持ちがよかった。
Svelte 自体については初めて触ったが、まだどうしたら良いのかわかっていない...
