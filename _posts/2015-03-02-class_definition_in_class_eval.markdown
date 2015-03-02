---
layout: post
title:  'class_eval内でのclass定義でのwarning'
date:   2015-03-02 11:00
categories: ruby
---

`class_eval` 内での `class` 定義でwarningがでる。

## サンプルコード

```ruby
class Hoge
  class HogeException < StandardError; end
end

Hoge.class_eval do
  class ClassEvalException < StandardError; end
end

puts HogeException       # => NameError
puts ClassEvalException  # => ClassEvalException
puts Hoge::HogeException # => Hoge::Exception

puts Hoge::ClassEvalException
# warning: toplevel constant ClassEvalException referenced by Hoge::ClassEvalException
# => Hoge::ClassEvalException
```

evalをやめる以外の解決方法ありますかね...

## 追記

[@moro](https://twitter.com/moro) から解決方法もらえました。

<blockquote class="twitter-tweet" lang="en"><p><a href="https://twitter.com/hrysd">@hrysd</a> class self::ClassEvalException; end</p>&mdash; MOROHASHI Kyosuke (@moro) <a href="https://twitter.com/moro/status/572244620735750145">March 2, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

```ruby
Hoge.class_eval do
  class self::ClassEvalException < StandardError; end
end

puts ClassEvalException       # => NameError
puts Hoge::ClassEvalException # => Hoge::ClassEvalException
```
