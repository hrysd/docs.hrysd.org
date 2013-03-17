require 'sinatra/base'
require 'haml'
require 'coffee_script'
require 'compass'
require 'bootstrap-sass'
require 'sprockets'
require 'sprockets-sass'
require 'sprockets-helpers'

module Org
  class App < Sinatra::Base
    set :root,      File.dirname(__FILE__)
    set :app_root,  File.expand_path(File.join(root, 'app'))
    set :views,     File.join(self.app_root, 'views')
    set :sprockets, Sprockets::Environment.new(root)

    helpers Sprockets::Helpers

    configure do
      %w[javascripts stylesheets images].each do |asset|
        sprockets.append_path File.join(app_root, 'assets', asset)
        sprockets.append_path Compass::Frameworks['bootstrap'].path + "/vendor/assets/#{asset}"
      end

      Sprockets::Helpers.configure do |config|
        config.environment = sprockets
        config.prefix = '/assets'
        config.digest = false
      end
      Sprockets::Sass.add_sass_functions = false
    end

    get '/' do
      haml :index
    end
  end
end
