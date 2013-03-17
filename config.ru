require './app'

map '/assets' do
  run Org::App.sprockets
end

map '/' do
  run Org::App
end
