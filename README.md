# transcendence

### To start in docker
```
docker-compose up
```

### To run local development environment
1. Install PostgreSQL 12.x and start it's service
2. [Install Ruby on Rails](https://edgeguides.rubyonrails.org/getting_started.html#creating-a-new-rails-project-installing-rails)
(you don't need to install SQLite3 because you already have PostgreSQL)
> use rbenv so you can install Ruby 3.0.0 (https://gorails.com/setup)
> and also make sure npm is installed in addition to node.js
3. ```cd ./srcs/app/srcs```
4. ```gem update```
5. ```bundle install```
6. ```yarn install``` (you may encounter [syntax error if you got python3 instead of python2](https://stackoverflow.com/a/62018221))
> you can check ```npm list``` and ```yarn list``` for installed node-modules and dependencies
7. Comment out username, password and host in ```./srcs/app/srcs/config/database.yml```
8. ```./bin/rake db:setup``` (you may encounter [role does not exist](https://stackoverflow.com/a/16974197) and [insufficient rights](https://stackoverflow.com/a/31669921) errors)
9. ```./bin/rake db:migrate```
10. Run development environment server: ```./bin/rails s```

### To run local production environment
1. I assume you already did development environment 1-9
2. Precompile assets: ```./bin/rails assets:precompile```
3. Run ```./bin/rails s -e production```

> After project update run ```./bin/rake db:migrate``` and ```./bin/rake db:reset``` (to make sure the db is updated)
