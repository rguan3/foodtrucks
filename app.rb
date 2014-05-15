require 'active_support/core_ext/hash/slice'
require 'grape'
require 'json'
require 'sinatra/base'
require 'sinatra/reloader'

# REST API
class API < Grape::API
  format :json

  resource :trucks do
    desc 'Get all trucks'
    get do
      if params[:fields]
        # Limit which fields are returned
        fields = params[:fields].split(',')
        API.data.values.collect { |truck| truck.slice(*fields) }
      else
        API.data.values
      end
    end

    desc 'Get a specific truck'
    route_param :id do
      get do
        API.data[params[:id]] or error!({error: 'Not Found'}, 404)
      end
    end
  end

  class << self
    # Lazily build data and cache
    def data
      @data ||= build_data
    end

    private
    def build_data
      # Load data from JSON file
      json           = File.read('data/sf_food_trucks.json')
      raw_data       = JSON.parse(json)

      # Only keep trucks with status "APPROVED"
      active_trucks  = raw_data.select { |truck| truck['status'] == 'APPROVED' }
      indexed_trucks = {}
      next_id        = 1

      # Add ID to each record and index by ID for easy lookup
      active_trucks.each do |t|
        id                 = next_id.to_s
        indexed_trucks[id] = t.merge('id' => id)
        next_id            += 1
      end

      indexed_trucks
    end
  end
end

# Web application
class Web < Sinatra::Base
  configure :development do
    register Sinatra::Reloader
  end

  set :haml, format: :html5

  Tilt.register 'html.haml', Tilt[:haml]

  get '/' do
    @js_file = 'index'
    haml :index
  end

  get '/about' do
    haml :about
  end
end
