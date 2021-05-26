import Backbone from "backbone";

const Users = {};

Users.CurrentUserModel = Backbone.Model.extend({
    url: '/api/users/current'
});

Users.TwoFactorModel = Backbone.Model.extend({
    url: '/api/settings/2fa'
});

Users.UserModel = Backbone.Model.extend({
    urlRoot: '/api/users'
});

Users.UserId = Backbone.Model.extend({
    initialize: function(options) {
        this.id = options.id;
    },
    url: function () {
        return '/api/users/' + this.id;
    }
});

Users.UserCollection = Backbone.Collection.extend({
    model: Users.UserModel,
    url: '/api/users',
    comparator: 'id'
});

Users.NoGuildUsersCollection = Backbone.Collection.extend({
    model: Users.UserModel,
    url: '/api/users_not_in_guild',
    comparator: 'id'
});

Users.GuildMembersCollection = Backbone.Collection.extend({
    model: Users.UserModel,
    initialize: function(model, options) {
        this.id = options.id;
    },
    url: function () {
        return '/api/guilds/' + this.id + '/members';
    },
    comparator:  function(model) {
        return [!model.get('guild_master'), !model.get('guild_officer')];
    }
});

Users.GuildRequestsCollection = Backbone.Collection.extend({
    model: Users.UserModel,
    initialize: function(model, options) {
        this.id = options.id;
    },
    url: function () {
        return '/api/guilds/' + this.id + '/requests';
    },
    comparator:  'id'
});

export default Users;
