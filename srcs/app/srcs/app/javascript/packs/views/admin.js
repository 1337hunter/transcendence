import Backbone from "backbone";
import _ from "underscore";
import Admin from "../models/admin";
import Utils from "../helpers/utils";

const AdminView = {};

$(function () {
	AdminView.SingleUserView = Backbone.View.extend({
        template: _.template($('#admin-singleuser-template').html()),
        events: {
            "keypress .displayname" : "updateOnEnter"
        },
        tagName: "tr",
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'error', this.onerror);
        },
        updateOnEnter: function (e) {
            if (e.keyCode !== 13) return;

            let newdisplayname = this.input.val().trim();
            if (this.model.get('displayname') !== newdisplayname)
            {
                e.preventDefault();
                e.stopPropagation();
                this.model.save({displayname: newdisplayname},
                    {patch: true, success: this.onsuccess});
            }
        },
        onerror: function (model, response) {
            if (response.responseJSON == null) //  true for undefined too
                Utils.appAlert('danger', {msg: 'No response from API'});
            else
                Utils.appAlert('danger', {json: response.responseJSON});
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
                function () { Utils.replaceavatar(this, model); });
            return this;
        }
    });

	AdminView.UserlistView = Backbone.View.extend({
		template: _.template($('#admin-userlist-template').html()),
		events: {
		    "click #refresh-button" :   "refresh"
        },
		initialize: function (filter, listname) {
            this.listname = listname;
		    if (listname == null)
		        this.listname = 'Userlist';
		    this.filter = filter;
		    this.collection = new Admin.UserCollection;
		    this.listenTo(this.collection, 'add', this.addOne);
		    this.listenTo(this.collection, 'reset', this.addAll);
            this.collection.fetch({data: {filter: this.filter},
                reset: true, error: this.onerror});
        },
		addOne: function (user) {
            user.view = new AdminView.SingleUserView({model: user});
            this.$("table#users-table tbody").append(user.view.render().el);
        },
        addAll: function () {
            this.collection.each(this.addOne, this);
        },
        refresh: function () {
            this.collection.fetch({data: {filter: this.filter},
                success: function () {Utils.appAlert('success', {msg: 'Up to date'});},
                error: this.onerror});
        },
        onerror: function (collection, response) {
            Utils.alertOnAjaxError(response);
        },
		render: function () {
			this.$el.html(this.template(_.clone({listname: this.listname})));
			this.addAll();
			return this;
		}
	});

	AdminView.ChatlistView = Backbone.View.extend({
		template: _.template($('#admin-chatlist-template').html()),
		events: {
		    "click #refresh-button" :   "refresh"
        },
		initialize: function () {
		    this.collection = new Admin.UserCollection;
		    this.listenTo(this.collection, 'add', this.addOne);
		    this.listenTo(this.collection, 'reset', this.addAll);
            this.collection.fetch({reset: true, error: this.onerror});
        },
		addOne: function (user) {
            user.view = new AdminView.SingleUserView({model: user});
            this.$("table#users-table tbody").append(user.view.render().el);
        },
        addAll: function () {
            this.collection.each(this.addOne, this);
        },
        refresh: function () {
            this.collection.fetch({
                success: function () {Utils.appAlert('success', {msg: 'Up to date'});},
                error: this.onerror});
        },
        onerror: function (collection, response) {
            Utils.alertOnAjaxError(response);
        },
		render: function () {
			this.$el.html(this.template());
			this.addAll();
			return this;
		}
	});

    AdminView.View = Backbone.View.extend({
        template: _.template($('#admin-template').html()),
        removeactive: function () {
            this.$('#admin-users-tab').removeClass('active', 200);
            this.$('#admin-bans-tab').removeClass('active', 200);
            this.$('#admin-admins-tab').removeClass('active', 200);
            this.$('#admin-chats-tab').removeClass('active', 200);
        },
        rendercontent: function (section) {
            this.section = section;
            this.removeactive();
            if (this.section === 'bans') {
                this.content = new AdminView.UserlistView('banned', 'Banlist');
                this.$('#admin-bans-tab').addClass('active', 200);
            } else if (this.section === 'admins') {
                this.content = new AdminView.UserlistView('admin', 'Admins');
                this.$('#admin-admins-tab').addClass('active', 200);
            } else if (this.section === 'chats') {
                this.content = new AdminView.ChatlistView();
                this.$('#admin-chats-tab').addClass('active', 200);
            } else {
                this.content = new AdminView.UserlistView();
                this.$('#admin-users-tab').addClass('active', 200);
            }
            this.$('#admin-content').html(this.content.render().el);
        },
        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });
});

export default AdminView;
