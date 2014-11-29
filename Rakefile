POSTS_DIRECTORY = File.join('.', '_posts').freeze

namespace :post do
  desc 'Generate new post'
  task :new, :title, :permalink do |_, args|
    now       = Time.now
    file_name = "#{now.strftime('%Y-%m-%d')}-#{args[:permalink]}.markdown"

    puts "Generate #{file_name}..."

    path = File.join(POSTS_DIRECTORY, file_name)

    File.open(path, 'w') do |f|
      f.puts '---'
      f.puts 'layout: post'
      f.puts "title: #{args[:title]}"
      f.puts "date: #{now.strftime('%Y-%m-%d %T')}"
      f.puts 'category:'
      f.puts "---"
    end
  end
end
