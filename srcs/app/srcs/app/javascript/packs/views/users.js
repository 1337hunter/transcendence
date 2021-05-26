import Backbone from "backbone";
import _ from "underscore";
import moment from "moment";
import Users from "../models/users";
import Utils from "../helpers/utils";
import MainSPA from "../main_spa";
import Guilds from "../models/guilds";

const UsersView = {};

$(function () {
	UsersView.SingleUserView = Backbone.View.extend({
        template: _.template($('#singleuser-template').html()),
        events: {
            "click" : "openprofile"
        },
        tagName: "tr",
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'error', this.onerror);
        },
        openprofile: function () {
            MainSPA.SPA.router.navigate("#/users/" + this.model.get('id'));
        },
        onerror: function (model, response) {
            Utils.alertOnAjaxError(response);
            this.model.attributes = this.model.previousAttributes();
            this.render();
        },
        onsuccess: function () {
            Utils.appAlert('success', {msg: 'Displayname has been changed'});
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.input = this.$('.displayname');
            let model = this.model;
            this.$('.user_icon').on("error",
                function () { Utils.replaceAvatar(this, model); });
            return this;
        }
    });

	UsersView.View = Backbone.View.extend({
		template: _.template($('#users-template').html()),
		events: {
		    "click #refresh-button" :   "refresh"
        },
		initialize: function () {
		    this.collection = new Users.UserCollection;
		    this.listenTo(this.collection, 'add', this.addOne);
		    this.listenTo(this.collection, 'reset', this.addAll);
            this.collection.fetch({reset: true, error: this.onerror});
        },
		addOne: function (user) {
            user.view = new UsersView.SingleUserView({model: user});
            this.$("#users-table").append(user.view.render().el);
        },
        addAll: function () {
            this.collection.each(this.addOne, this);
        },
        refresh: function () {
            this.collection.fetch({
                success: function () {Utils.appAlert('success', {msg: 'Up to date'});},
                error: this.onerror});
        },
        onerror: function (model, response) {
		    Utils.alertOnAjaxError(response);
        },
		render: function () {
			this.$el.html(this.template());
			this.addAll();
			return this;
		}
	});

	UsersView.ProfileView = Backbone.View.extend({
        template: _.template($('#user-profile-template').html()),
        events: {
            "click #refresh-button" :   "refresh",
            "click .add-friend-button" : "addFriend"
        },
        initialize: function (id) {
            this.model = new Users.UserId({id: id});
            this.listenTo(this.model, 'change', this.render);
            this.model.fetch({error: this.onerror});
            this.model.attributes.number_of_friends = 2;
        //  this.model.attributes.number_of_friends = this.model.attributes.friends.length;
        //    this.model.set({number_of_friends: this.model.attributes.friends.length});
        },
        addFriend: function () {
            console.log("Add friend action");
            return Backbone.ajax(_.extend({
                url: 'api/friends/' + this.model.id,
                method: "POST",
                data: this.attributes,
                dataType: "json",
            }));
        },
        addOne: function (user) {
            var user_element = new Users.UserModel(user);
            user_element.view = new UsersView.SingleUserView({model: user_element});
            this.$("#friends-table").append(user_element.view.render().el);
        },
        addAll: function () {
            var $this = this;
            this.model.attributes.friends.forEach(function(user) {
                $this.addOne(user);
            });
        },
        refresh: function () {
            this.model.fetch({
                success: function () {
                    Utils.appAlert('success', {msg: 'Up to date'});},
                    error: this.onerror
            });
        },
        onerror: function (model, response) {
            Utils.alertOnAjaxError(response);
        },
        render: function () {
            this.model.attributes.last_seen_at = moment(this.model.get('last_seen_at')).fromNow();
            this.model.attributes.number_of_friends = this.model.attributes.friends.length;
            this.$el.html(this.template(this.model.toJSON()));
            this.input = this.$('.displayname');
            let model = this.model;
            this.$('.user_avatar').on("error",
                function () { Utils.replaceAvatar(this, model); });

            //  TODO: temp solution.
            if (MainSPA.SPA.router.currentuser.get('id') === this.model.get('id')) {
                this.$('button.btn-profile-actions').prop('disabled', true);
                this.$('div.profile-badges')
                    .prepend("<span class=\"badge rounded-pill bg-primary\">You</span>")
            }
            this.addAll();
            return this;
        }
    });

    UsersView.InviteUserView = Backbone.View.extend({
        template: _.template($('#invite-user-template').html()),
        //template2: _.template($('#invited-user-template').html()),
        events: {
            "click" : "openprofile",
            "click #invite-button" :   "invite",
            "click #cancel-invite-button" :   "cancelInvite"
        },
        tagName: "tr",
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'error', this.onerror);
        },
        openprofile: function () {
            MainSPA.SPA.router.navigate("#/users/" + this.model.get('id'));
        },
        onerror: function (model, response) {
            Utils.alertOnAjaxError(response);
            this.model.attributes = this.model.previousAttributes();
            this.render();
        },
        onsuccess: function () {
            Utils.appAlert('success', {msg: 'Done'});
        },
        render: function() {
            /*let view = this;
            this.model.fetch({
                success: function (model) {
                    if (invited)
                        view.$el.html(view.template1(view.model.toJSON()));
                    else
                        view.$el.html(view.template2(view.model.toJSON()));
                }});*/
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    UsersView.AvailableForGuildView = Backbone.View.extend({
        template: _.template($('#users-template').html()),
        cur_user: new Users.CurrentUserModel,
        events: {
            "click #refresh-button" :   "refresh"
        },
        initialize: function () {
            this.collection = new Users.NoGuildUsersCollection;
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'change', this.render);
            this.collection.fetch({reset: true, error: this.onerror});
        },
        addOne: function (user) {
            let view = this;
            this.cur_user.fetch({
                success: function (model) {
                    if (model.get('guild_master') || model.get('guild_officer'))
                        user.view = new UsersView.InviteUserView({model: user});
                    else
                        user.view = new UsersView.SingleUserView({model: user});
                    view.$("tbody").append(user.view.render().$el);
                },
                error: function () {
                    user.view = new UsersView.SingleUserView({model: user});
                    view.$("tbody").append(user.view.render().$el);
                }
            });
        },
        addAll: function () {
            this.collection.each(this.addOne, this);
        },
        refresh: function () {
            this.collection.fetch({
                success: function () {Utils.appAlert('success', {msg: 'Up to date'});},
                error: this.onerror});
        },
        onerror: function (model, response) {
            Utils.alertOnAjaxError(response);
        },
        render: function () {
            this.$el.html(this.template());
            this.addAll();
            return this;
        }
    });

    UsersView.GuildRequestView = Backbone.View.extend({
        template: _.template($('#guild-request-template').html()),
        events: {
            "click" : "openprofile",
            "click #accept-button" :   "accept",
            "click #decline-button" :   "decline"
        },
        tagName: "tr",
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'error', this.onerror);
        },
        openprofile: function () {
            MainSPA.SPA.router.navigate("#/users/" + this.model.get('id'));
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        accept: function () {
            let view = this;
            this.model.fetch({
                success: function (model) {
                    $.ajax({
                        url: 'api/users/' + model.get('id') + '/add',
                        type: 'PUT',
                        data: `guild_accepted=${true}`,
                        success: () => {
                            Utils.appAlert('success', {msg: model.get('name') + '\'s request accepted'});

                        },
                        error: (response) => {
                            Utils.alertOnAjaxError(response);
                        }
                    });
                },
                error: view.onerror
            });
        },
        decline: function () {
            let view = this;
            this.model.fetch({
                success: function (model) {
                    $.ajax({
                        url: 'api/users/' + model.get('id') + '/leave',
                        type: 'PUT',
                        success: () => {
                            Utils.appAlert('success', {msg: model.get('name') + ' request declined'});

                        },
                        error: (response) => {
                            Utils.alertOnAjaxError(response);
                        }
                    });
                },
                error: view.onerror
            });
        }
    });

    UsersView.GuildRequestsView = Backbone.View.extend({
        template: _.template($('#users-template').html()),
        events: {
            "click #refresh-button" :   "refresh"
        },
        initialize: function (id) {
            this.collection = new Users.GuildRequestsCollection([], {id: id});
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'change', this.render);
            this.collection.fetch({reset: true, error: this.onerror});
        },
        addOne: function (user) {
            user.view = new UsersView.GuildRequestView({model: user});
            this.$("tbody").append(user.view.render().el);
        },
        addAll: function () {
            this.collection.each(this.addOne, this);
        },
        refresh: function () {
            this.collection.fetch({
                success: function () {Utils.appAlert('success', {msg: 'Up to date'});},
                error: this.onerror});
        },
        onerror: function (model, response) {
            Utils.alertOnAjaxError(response);
        },
        render: function () {
            this.$el.html(this.template());
            this.addAll();
            return this;
        }
    });

    UsersView.GuildMemberView = Backbone.View.extend({
        template1: _.template($('#guildmember-template').html()),
        template2: _.template($('#guildmember-edit-template').html()),
        cur_user: new Users.CurrentUserModel,
        events: {
            "click" : "openprofile",
            "click #to-officer-button" : "toOfficer",
            "click #to-master-button" : "toMaster",
            "click #demote-button" : "demote",
            "click #kick-button" : "kick"
        },
        tagName: "tr",
        initialize: function (id) {
            this.listenTo(this.model, 'change', this.render(id));
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'error', this.onerror);
        },
        openprofile: function () {
            MainSPA.SPA.router.navigate("#/users/" + this.model.get('id'));
        },
        render: function(id) {
            let view = this;
            this.cur_user.fetch({
                success: function (model) {
                    if (model.get('id') != view.model.get('id') && model.get('id') == id
                        && (model.get('guild_master')
                            || ((model.get('guild_officer') && !view.model.get('guild_officer') && !view.model.get('guild_master'))))
                        )
                        view.$el.html(view.template2(view.model.toJSON()));
                    else
                        view.$el.html(view.template1(view.model.toJSON()));
                },
                error: function () {
                    view.$el.html(view.template1(view.model.toJSON()));
                }
            });
            return this;
        },
        update: function (data) {
            let view = this;
            this.model.fetch({
                success: function (model) {
                    $.ajax({
                        url: 'api/users/' + model.get('id') + '/add',
                        type: 'PUT',
                        data: data,
                        success: () => {
                            Utils.appAlert('success', {msg: model.get('name') + '\'s role changed'});
                            view.render();
                        },
                        error: (response) => {
                            Utils.alertOnAjaxError(response);
                        }
                    });
                },
                error: view.onerror
            });
        },
        demote: function () {
            this.update(`guild_officer=${false}`)
        },
        toOfficer: function () {
            this.update(`guild_officer=${true}`)
        },
        toMaster: function () {
            this.update(`guild_master=${true}`)
        },
        kick:  function() {
            let view = this;
            this.model.fetch({
                success: function (model) {
                    $.ajax({
                        url: 'api/users/' + model.get('id') + '/leave',
                        type: 'PUT',
                        success: () => {
                            Utils.appAlert('success', {msg: 'You kicked ' + model.get('displayname')});

                        },
                        error: (response) => {
                            Utils.alertOnAjaxError(response);
                        }
                    });
                },
                error: view.onerror
            });
        }
    });

    UsersView.GuildMembersView = Backbone.View.extend({
        template: _.template($('#guildmembers-template').html()),
        events: {
            "click #refresh-button" :   "refresh"
        },
        initialize: function (id) {
            this.collection = new Users.GuildMembersCollection([], {id: id});
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'change', this.render);
            this.collection.fetch({reset: true, error: this.onerror});
        },
        addOne: function (user, id) {
            user.view = new UsersView.GuildMemberView({model: user, id: id});
            this.$("tbody").append(user.view.render().el);
        },
        addAll: function () {
            this.collection.each(this.addOne, this);
        },
        refresh: function () {
            this.collection.fetch({
                success: function () {Utils.appAlert('success', {msg: 'Up to date'});},
                error: this.onerror});
        },
        onerror: function (model, response) {
            Utils.alertOnAjaxError(response);
        },
        render: function () {
            this.$el.html(this.template());
            this.addAll();
            return this;
        }
    });

});

export default UsersView;
