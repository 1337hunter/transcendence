from	ruby:3.0.0

run		apt-get update -qq && apt-get install -y  postgresql-client curl vim
run		curl -sL https://deb.nodesource.com/setup_12.x | bash -
run 	curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
run		echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

run		apt-get update
run		apt-get install -y nodejs
run     apt-get install -y yarn

workdir	/app
run		gem install bundler
run     gem install rails

copy    ./srcs/ /app/
env		BUNDLE_GEMFILE="/app/Gemfile"
run		bundle install
# run	yarn add bootstrap jquery popper.js
# run	yarn add underscore
# run	yarn add backbone
# this all can be replaced with yarn install which will all packages from package.json
run		yarn install

# Add a script to be executed every time the container starts.
copy	entrypoint.sh /usr/bin/
run		chmod +x /usr/bin/entrypoint.sh
expose	3000
entrypoint ["entrypoint.sh"]

# Start the main process.
# cmd		["rails", "server", "-b", "0.0.0.0"]
