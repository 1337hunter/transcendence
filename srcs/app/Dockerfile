FROM	ruby:3.0.0

RUN	apt-get update -qq && apt-get install -y  postgresql-client curl vim
RUN	curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN 	curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN	echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN	apt-get update
RUN	apt-get install -y nodejs
RUN     apt-get install -y yarn

WORKDIR	/app
RUN	gem install bundler
RUN     gem install rails

COPY    ./ruby/ /app/
ENV	BUNDLE_GEMFILE="/app/Gemfile"
RUN	bundle install
RUN	yarn add bootstrap jquery popper.js
RUN	yarn add underscore
RUN	yarn add backbone

# Add a script to be executed every time the container starts.
COPY	entrypoint.sh /usr/bin/
RUN	chmod +x /usr/bin/entrypoint.sh
EXPOSE	3000
ENTRYPOINT ["entrypoint.sh"]

# Start the main process.
CMD	["rails", "server", "-b", "0.0.0.0"]
