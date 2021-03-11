# transcendence

### To start in docker
```
docker-compose up
```

### To start locally
1. Install PostgreSQL 12.x
2. [Install Ruby on Rails](https://edgeguides.rubyonrails.org/getting_started.html#creating-a-new-rails-project-installing-rails)
(you don't need to install SQLite3 because you already have PostgreSQL)
3. ```cd ./srcs/app/srcs```
4. ```bundle install```
5. ```yarn install```
6. Comment out username, password and host in ./srcs/app/srcs/config/database.yml
7. ```./bin/rails s```
