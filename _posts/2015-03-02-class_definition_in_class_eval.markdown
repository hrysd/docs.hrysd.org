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
