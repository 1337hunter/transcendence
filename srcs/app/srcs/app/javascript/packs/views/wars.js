import Backbone from "backbone";
import _ from "underscore";
import Wars from "../models/wars";
import Utils from "../helpers/utils";
import MainSPA from "../main_spa";

const WarsView = {};

$(function () {
    WarsView.WarView = Backbone.View.extend({
        template: _.template($('#war-template').html()),
        events: {
            "click #more-button" :   "warProfile"
        },
        tagName: "div",
        initialize: function () {
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function() {
            this.model.attributes.start = Utils.getShortDate(this.model.attributes.start);
            this.model.attributes.end = Utils.getShortDate(this.model.attributes.end)
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        warProfile: function () {
            MainSPA.SPA.router.navigate("#/wars/" + this.model.get('id'));
        }
    });

    WarsView.View = Backbone.View.extend({
        template: _.template($('#wars-template').html()),
        events: {
            "click #refresh-button" :   "refresh"
        },
        initialize: function () {
            this.collection = new Wars.WarCollection;
            this.listenTo(this.collection, 'change', this.render);
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.collection.fetch({reset: true, error: this.onFetchError});
        },
        addOne: function (war) {
            war.this = new WarsView.WarView({model: war});
            this.el.append(war.this.render().el);
        },
        addAll: function () {
            this.collection.each(this.addOne, this);
        },
        refresh: function () {
            this.collection.fetch({
                success: function () {Utils.appAlert('success', {msg: 'Up to date'});},
                error: this.onFetchError});
        },
        onFetchError: function () {
            Utils.appAlert('danger', {msg: 'Fetch from API failed'});
        },
        render: function () {
            this.$el.html(this.template());
            this.addAll();
            return this;
        }
    });

    WarsView.GuildWarsView = Backbone.View.extend({
        template: _.template($('#wars-template').html()),
        events: {
            "click #refresh-button" :   "refresh"
        },
        initialize: function (id) {
            this.collection = new Wars.GuildWarsCollection([], {id: id});
            this.listenTo(this.collection, 'change', this.render);
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.collection.fetch({reset: true, error: this.onFetchError});
        },
        addOne: function (war) {
            war.this = new WarsView.WarView({model: war});
            this.el.append(war.this.render().el);
        },
        addAll: function () {
            this.collection.each(this.addOne, this);
        },
        refresh: function () {
            this.collection.fetch({
                success: function () {Utils.appAlert('success', {msg: 'Up to date'});},
                error: this.onFetchError});
        },
        onFetchError: function () {
            Utils.appAlert('danger', {msg: 'Fetch from API failed'});
        },
        render: function () {
            this.$el.html(this.template());
            this.addAll();
            return this;
        }
    });

    WarsView.WarInvitationView = Backbone.View.extend({
        //cur_user: new Users.CurrentUserModel,
        template: _.template($('#war-invite-template').html()),
        events: {
            "click #accept-button": "accept",
            "click #decline-button": "decline",
            "click #more-button" :   "warProfile"
        },
        tagName: "div",
        initialize: function (guild) {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'error', this.onerror);
            this.g_id = guild.id;
        },
        render: function() {
            this.model.attributes.start = Utils.getShortDate(this.model.attributes.start);
            this.model.attributes.end = Utils.getShortDate(this.model.attributes.end)
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        warProfile: function () {
            MainSPA.SPA.router.navigate("#/wars/" + this.model.get('id'));
        },
        accept:  function() {
            $.ajax({
                url: 'api/guilds/' + this.g_id + '/war_invites/' + this.model.get('id'),
                type: 'PUT',
                success: () => {
                    Utils.appAlert('success', {msg: 'Request accepted'});
                    this.remove();
                },
                error: (response) => {
                    Utils.alertOnAjaxError(response);
                }
            });
        },
        decline:  function() {
            this.model.destroy();
            //TODO:feedback on error
        },
        remove: function() {
            this.$el.empty().off();
            this.stopListening();
            return this;
        },
        onerror: function (model, response) {
            Utils.alertOnAjaxError(response);
        }
    });

    WarsView.WarInvitesView = Backbone.View.extend({
        template: _.template($('#war-invites-template').html()),
        events: {
            "click #refresh-button" :   "refresh"
        },
        initialize: function (id) {
            this.collection = new Wars.WarInvitesCollection([], {id: id});
            this.listenTo(this.collection, 'change', this.render);
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.collection.fetch({reset: true, error: this.onerror});
            this.g_id = id;
        },
        addOne: function (war) {
            war.view = new WarsView.WarInvitationView({model: war, id: this.g_id});
            this.el.append(war.view.render().el);
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

    WarsView.WarRequestView = Backbone.View.extend({
        //cur_user: new Users.CurrentUserModel,
        template: _.template($('#war-request-template').html()),
        events: {
            "click #cancel-button": "cancelRequest",
            "click #more-button" :   "warProfile"
        },
        tagName: "div",
        initialize: function (/*user*/) {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'error', this.onerror);
            // this.u_id = user.id;
        },
        render: function() {
            this.model.attributes.start = Utils.getShortDate(this.model.attributes.start);
            this.model.attributes.end = Utils.getShortDate(this.model.attributes.end)
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        warProfile: function () {
            MainSPA.SPA.router.navigate("#/wars/" + this.model.get('id'));
        },
        cancelRequest:  function() {
            this.model.destroy();
           // TODO:feedback on error
        },
        onerror: function (model, response) {
            Utils.alertOnAjaxError(response);
        }
    });

    WarsView.WarRequestsView = Backbone.View.extend({
        template: _.template($('#war-invites-template').html()),
        events: {
            "click #refresh-button" :   "refresh"
        },
        initialize: function (id) {
            this.collection = new Wars.WarRequestsCollection([], {id: id});
            this.listenTo(this.collection, 'change', this.render);
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.collection.fetch({reset: true, error: this.onerror});
            //this.u_id = id;
        },
        addOne: function (war) {
            war.view = new WarsView.WarRequestView({model: war});
            this.el.append(war.view.render().el);
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

    WarsView.ProfileView = Backbone.View.extend({
        //cur_user : new Users.CurrentUserModel,
        template: _.template($('#war-profile-template').html()),
        events: {
            "click #refresh-button" :   "refresh"
        },
        initialize: function (id) {
            this.model = new Wars.WarId({id: id});
            this.listenTo(this.model, 'change', this.render);
            this.model.fetch({error: this.onerror});
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
            this.model.attributes.wartime_start = Utils.getTime(this.model.attributes.wartime_start);
            this.model.attributes.wartime_end = Utils.getTime(this.model.attributes.wartime_end);
            //TODO:js sets+3 to time
            //this.model.attributes.start = new Date(this.model.attributes.start);
            //this.model.attributes.end = new Date(this.model.attributes.end);
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

});

export default WarsView;