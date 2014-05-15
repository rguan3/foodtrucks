require './app'

# Load Sinatra and Grape Rack components. Add Grape API to the top of the stack so errors aren't intercepted by Sinatra.
run Rack::Cascade.new [Web, API]
