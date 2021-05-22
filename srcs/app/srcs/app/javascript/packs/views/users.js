import Backbone from "backbone";
import _ from "underscore";
import moment, { relativeTimeThreshold } from "moment";
import Users from "../models/users";
import Utils from "../helpers/utils";
import MainSPA from "../main_spa";

const UsersView = {};

$(function () {
	UsersView.SingleUserView = Backbone.View.extend({
        template: _.template($('#singleuser-template').html()),
        events: {
            "click" : "openprofile",
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

    UsersView.FriendsView = Backbone.View.extend({
        template: _.template($('#friends-template').html()),
        events: {
            "click .users-displayname" : "openprofile",
            "click .accept-friend-button" : "acceptFriend",
            "click .remove-friend-button" : "removeFriend",
        },
        tagName: "tr",
        initialize: function (e) {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'error', this.onerror);
            this.model.attributes.status = e.friend_status;
            this.model.attributes.current_user_id = MainSPA.SPA.router.currentuser.get('id');
            this.model.attributes.main_id = e.main_id;
        },
        openprofile: function () {
            MainSPA.SPA.router.navigate("#/users/" + this.model.get('id'));
        },
        acceptFriend: function () {
            return Backbone.ajax(_.extend({
                url: 'api/users/' + this.model.attributes.main_id + '/accept_friend',
                method: "POST",
                data: {friend_id: this.model.attributes.id},
                dataType: "json",
            }));
        },
        removeFriend: function () {
            this.remove();
            return Backbone.ajax(_.extend({
                url: 'api/users/' + this.model.attributes.main_id + '/remove_friend',
                method: "POST",
                data: {friend_id: this.model.attributes.id},
                dataType: "json",
            }));
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
            if (this.model.attributes.status == "no" && this.model.attributes.main_id != this.model.attributes.current_user_id)
                return this;
            console.log(this.model);
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
        },
        addFriend: function () {
            return Backbone.ajax(_.extend({
                url: 'api/users/' + this.model.id + '/add_friend',
                method: "POST",
                data: this.attributes,
                dataType: "json",
            }));
        },
        addOne: function (user) {
            var user_element = new Users.UserModel(user);
            user_element.view = new UsersView.FriendsView({model: user_element, friend_status: "friend", main_id: this.model.attributes.id});
            this.$("#friends-table").append(user_element.view.render().el);
        },
        addRequested: function (user) {
            var user_element = new Users.UserModel(user);
            user_element.view = new UsersView.FriendsView({model: user_element, friend_status: "no", main_id: this.model.attributes.id});
            this.$("#friends-table").append(user_element.view.render().el);
        },
        addAll: function () {
            var $this = this;
            this.model.attributes.requested_friends.forEach(function(user) {
                $this.addRequested(user);
            })
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
});

export default UsersView;
