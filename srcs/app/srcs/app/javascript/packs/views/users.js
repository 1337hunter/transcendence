import Backbone from "backbone";
import _ from "underscore";
import moment from "moment";
import Users from "../models/users";
import Utils from "../helpers/utils";
import MainSPA from "../main_spa";

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
            console.log("Add friend action");
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
            return this;
        }
    });
});

export default UsersView;
