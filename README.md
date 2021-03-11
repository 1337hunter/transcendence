# transcendence

### To start in docker
```
docker-compose up
```

### To run local development environment
1. Install PostgreSQL 12.x and start it's service.
2. [Install Ruby on Rails](https://edgeguides.rubyonrails.org/getting_started.html#creating-a-new-rails-project-installing-rails)
(you don't need to install SQLite3 because you already have PostgreSQL)
> use rbenv so you can install Ruby 3.0.0 (https://gorails.com/setup)
3. ```cd ./srcs/app/srcs```
4. ```gem update```
5. ```bundle install```
6. ```yarn install``` (you may encounter [syntax error](https://stackoverflow.com/questions/60394291/error-node-modules-node-sass-command-failed))
7. Comment out username, password and host in ./srcs/app/srcs/config/database.yml
8. ```./bin/rake db:create``` (you may encounter [role does not exist](https://stackoverflow.com/questions/16973018/createuser-could-not-connect-to-database-postgres-fatal-role-tom-does-not-e/16974197#16974197) and [insufficient rights](https://stackoverflow.com/a/31669921) errors)
9. Run development environment server: ```./bin/rails s```

### To run local production environment
1. Precompile assets: ```./bin/rails assets:precompile```
2. Run ```./bin/rails s -e production```
