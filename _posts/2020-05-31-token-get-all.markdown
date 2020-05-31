---
layout: post
title: PHP で使われてなさそうなグローバル関数を見つけたい...
date: 2020-05-31 21:00
categories: PHP
---

## きっかけ

特定のファイルに定義されているグローバルな関数がどれくらい使われているのかシュッと調べたかった。
軽くググった感じだと PHP は組み込みで字句解析ができそうだったので、それとシェルコマンドを使って実現してみた。

## 対象

対象は以下のように関数が定義してあるファイル。

```php
<?php

function globalFunction() { }

function globalFunction_2() { }
```

## 方法

考えた方法は

- ARGV に渡されたファイルを読み込む
- PHP 組み込みの関数を使ってコードをTokenizeする
    - [token\_get\_all - PHP](https://www.php.net/manual/ja/function.token-get-all.php)
- Token の並びが関数っぽいものを出力
- 出力された関数名をで `grep` する

というという感じで、実際のコードは以下。

```php
<?php
$source = implode('', file($argv[1]));

$tokens = token_get_all($source, TOKEN_PARSE);

const MAPPING = [
    'start' => ['T_FUNCTION' => true],
    'end' => ['T_STRING' => true]
];

$processing = false;
foreach ($tokens as $token) {
    if (is_array($token)) {
        if ($processing) {
            if (MAPPING['end'][token_name($token[0])]) {
                echo $token[1], PHP_EOL;
                $processing = false;
            }
        } else {
            if (MAPPING['start'][token_name($token[0])]) {
                $processing = true;
            }
        }
    }
}
```

で、これを `function_names.php` みたいな名前で保存し、`xargs` と組み合わせて実行してあげると以下のように出力される。

```bash
$ php function_names.php global_functions.php | xargs -n 1 -I{} sh -c "echo {}; git grep {} | wc -l | tr -d ' '"
globalFunction
10
```

🎉 🎉 🎉 🎉

## 最後に

実質 PHP の処理系があれば確認できるところが便利なとこかな...?ざっと調べたい時なんかにどうぞ！もっといい方法があれば教えてください。
