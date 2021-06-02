import Backbone from "backbone";
import MainSPA from "../main_spa";

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

Users.MatchModel = Backbone.Model.extend({
    idAttribute: "id",
    url: function () {
        return '/api/users/' + MainSPA.SPA.router.currentuser.get('id') + '/matches/' + this.id
    }
});

Users.MatchesCollection = Backbone.Collection.extend({
    initialize: function (option) {
        this.id = option.id;
    },
    model: Users.MatchModel,
    url: function () {
        return '/api/users/' + this.id + '/matches';
    },
    comparator: 'id'
});

Users.UserCollection = Backbone.Collection.extend({
    model: Users.UserModel,
    url: '/api/users',
    comparator: 'id'
});

export default Users;
