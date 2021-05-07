# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.create(id: 2, displayname: "dummy0", wins: 0, loses: 0, elo: 0, created_at: "2021-04-11 21:50:15.875326000 +0000", updated_at: "2021-04-11 21:51:59.077554000 +0000", email: "dummy0@21-school.ru", nickname: "doom0", provider: "marvin", uid: "000000", avatar: "lamo", avatar_url: "/assets/avatar_default.jpg", avatar_default_url: "/assets/avatar_default.jpg", password: "lmaolmao", last_seen_at: "2021-05-01 23:00:15.269276000 +0000")
User.create(id: 3, displayname: "dummy1", wins: 0, loses: 0, elo: 0, created_at: "2021-04-11 21:50:15.875326000 +0000", updated_at: "2021-04-11 21:51:59.077554000 +0000", email: "dummy1@21-school.ru", nickname: "doom1", provider: "marvin", uid: "000000", avatar: "lamo", avatar_url: "/assets/avatar_default.jpg", avatar_default_url: "/assets/avatar_default.jpg", password: "lmaolmao", last_seen_at: "2021-05-01 23:00:17.493393000 +0000")
User.create(id: 4, displayname: "dummy2", wins: 0, loses: 0, elo: 0, created_at: "2021-04-11 21:50:15.875326000 +0000", updated_at: "2021-04-11 21:51:59.077554000 +0000", email: "dummy2@21-school.ru", nickname: "doom2", provider: "marvin", uid: "000000", avatar: "lamo", avatar_url: "/assets/avatar_default.jpg", avatar_default_url: "/assets/avatar_default.jpg", password: "lmaolmao", last_seen_at: "2021-05-02 00:15:41.697153000 +0000")
User.create(id: 5, displayname: "dummyban0", wins: 0, loses: 0, elo: 0, created_at: "2021-04-11 21:50:15.875326000 +0000", updated_at: "2021-04-11 21:51:59.077554000 +0000", email: "dummyban0@21-school.ru", nickname: "doom3", provider: "marvin", uid: "000000", avatar: "lamo", avatar_url: "/assets/avatar_default.jpg", avatar_default_url: "/assets/avatar_default.jpg", password: "lmaolmao", banned: true, last_seen_at: "2021-05-01 23:00:21.517288000 +0000")
User.create(id: 6, displayname: "dummyban1", wins: 0, loses: 0, elo: 0, created_at: "2021-04-11 21:50:15.875326000 +0000", updated_at: "2021-04-11 21:51:59.077554000 +0000", email: "dummyban1@21-school.ru", nickname: "doom4", provider: "marvin", uid: "000000", avatar: "lamo", avatar_url: "/assets/avatar_default.jpg", avatar_default_url: "/assets/avatar_default.jpg", password: "lmaolmao", banned: true, ban_reason: "inadequate chat behaviour", last_seen_at: "2021-05-01 23:00:23.757589000 +0000")

Room.create(id: 1, name: "admin", private: true)
Room.create(id: 2, name: "general", private: false)
Room.create(id: 3, name: "random", private: false)

Guild.create([{
                name: "Cats",
                anagram: "cat",
                score: 100
              },
              {
                name: "Dogs",
                anagram: "dog",
              }])

