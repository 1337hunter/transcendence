import Backbone from "backbone";
import _ from "underscore";
import moment, { relativeTimeThreshold } from "moment";
import Users from "../models/users";
import Utils from "../helpers/utils";
import MainSPA from "../main_spa";
import Messages from "../models/messages";
import MessagesView from "./messages";

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
            this.remove();
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
            this.$el.html(this.template(this.model.toJSON()));
            this.input = this.$('.displayname');
            let model = this.model;
            this.$('.user_icon').on("error",
                function () { Utils.replaceAvatar(this, model); });
            return this;
        }
    });

    UsersView.SingleMatchView = Backbone.View.extend({
        template: _.template($('#singlematch-template').html()),
        events: {},
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'error', this.onerror);
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
            "click #refresh-button"         :   "refresh",
            "click .add-friend-button"      :   "addFriend",
            "click #message_btn"            :   "message_to_user",
            "click .remove-friend-button"   :   "removeFriend",
            "click .invite-to-battle"       :   "inviteToBattle",
        },
        initialize: function (id) {
            this.id = id;
            this.model = new Users.UserId({id: id});
            this.current_user = new Users.CurrentUserModel();
            this.listenTo(this.model, 'change', this.render);
            this.model.fetch({error: this.onerror});
            this.current_user.fetch();
            // add to user profile matches collection
           this.matches_collection = new Users.MatchesCollection({id :this.model.attributes.id});
		   this.listenTo(this.matches_collection, 'add', this.addOneMatch);
		   this.listenTo(this.matches_collection, 'reset', this.addAllMatches);
           this.matches_collection.fetch({reset: true, error: this.onerror});
        },
        addOneMatch: function (match) {
            match.view = new UsersView.SingleMatchView({model: match});
            this.$("#matches-table").append(user.view.render().el);
        },
        addAllMatches: function () {
            this.matches_collection.each(this.addOneMatch, this);
        },
        inviteToBattle: function () {
            console.log("Invite to battle");
            return Backbone.ajax(_.extend({
                url: 'api/users/' + MainSPA.SPA.router.currentuser.get('id') + '/matches/',
                method: "POST",
                data: {invited_user_id: this.model.attributes.id},
                dataType: "json",
            }));
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
        removeFriend: function () {
            return Backbone.ajax(_.extend({
                url: 'api/users/' + MainSPA.SPA.router.currentuser.get('id') + '/remove_friend',
                method: "POST",
                data: {friend_id: this.model.attributes.id},
                dataType: "json",
            }));
        },
        refresh: function () {
            this.model.fetch({
                success: function () {
                    Utils.appAlert('success', {msg: 'Up to date'});},
                    error: this.onerror
            });
        },
        message_to_user: function () {
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
            var current_user = MainSPA.SPA.router.currentuser;
            for (let i = 0; i < this.model.attributes.friends.length; i++)
            {
                if (this.model.attributes.friends[i].id == current_user.get('id'))
                {
                    this.$('.add-friend-button').html('Remove Friend');
                    this.$('.add-friend-button').attr('class', 'btn btn-outline-danger btn-profile-actions remove-friend-button');
                }
            }
            if (current_user.get('id') === this.model.get('id')) {
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
