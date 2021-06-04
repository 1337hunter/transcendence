import Backbone from "backbone";
import _ from "underscore";
import Guilds from "../models/guilds";
import Users from "../models/users";
import Utils from "../helpers/utils";
import MainSPA from "../main_spa";

const GuildsView = {};

$(function () {
    GuildsView.SingleGuildView = Backbone.View.extend({
        cur_user: new Users.CurrentUserModel,
        template1: _.template($('#guild-template-other').html()),
        template2: _.template($('#guild-template-leave').html()),
        template3: _.template($('#guild-template-join').html()),
        template4: _.template($('#guild-template-other-war').html()),
        template5: _.template($('#guild-template-accept').html()),
        template6: _.template($('#guild-template-cancel').html()),
        events: {
            "click #join-button": "join",
            "click #cancel-button": "cancelRequest",
            "click #accept-button": "accept",
            "click #decline-button": "decline",
            "click #leave-button": "leave",
            "click #war-button": "declareWar"
        },
        tagName: "div",
        initialize: function () {
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function() {
            let view = this;
            let id = this.model.get('id');
            this.cur_user.fetch({
                success: function (model) {
                    if (model.get('guild_accepted')) {
                        if (model.get('guild_id') == id)
                            view.$el.html(view.template2(view.model.toJSON()));
                        else if (model.get('guild_officer') || model.get('guild_master'))
                            view.$el.html(view.template4(view.model.toJSON()));
                        else
                            view.$el.html(view.template1(view.model.toJSON()));
                    }
                    else if (model.get('guild_id') == id)
                        view.$el.html(view.template6(view.model.toJSON()));
                    else if (Utils.has_guild_invitation(model.get('id'), view.model.get('id')))
                        view.$el.html(view.template5(view.model.toJSON()));
                    else
                        view.$el.html(view.template3(view.model.toJSON()));
                }});
            return this;
        },
        /*guildProfile: function () {
            /*let id = this.model.get('id');
            this.cur_user.fetch({
                success: function (model) {
                    if (model.get('guild_id') == id && (model.get('guild_master') || model.get('guild_officer')))
                        MainSPA.SPA.router.navigate("#/guilds/" + id + "/edit");
                    else
                        MainSPA.SPA.router.navigate("#/guilds/" + id);
                }});
        },*/
        join:  function() {
           let view = this;
           let name;
           this.cur_user.fetch({
                success: function (model) {
                    if (model.get('guild_accepted')) {
                        Utils.appAlert('danger', {msg: 'You are in the guild already'});
                        return;
                    }
                    if (model.get('guild_id')) {
                        if (model.get('guild_id') == view.model.get('id')) {
                            Utils.appAlert('danger', {msg: 'Request already sent'});
                            return;
                        }
                        name = model.attributes.guild.name;
                    }
                    model.save({guild_id: view.model.id}, {
                            patch: true,
                            success: function () {
                                Utils.appAlert('success', {msg: 'Request to ' + view.model.get('name') + ' sent'});
                                if (name)
                                    Utils.appAlert('success', {msg: 'Request to ' + name + ' canceled'});
                                view.render();
                            },
                            onerror: Utils.alertOnAjaxError
                    });
                    },
                error: Utils.alertOnAjaxError
            });
        },
        cancelRequest:  function() {
            let view = this;
            this.cur_user.fetch({
                success: function (model) {
                    if (model.get('guild_accepted')) {
                        Utils.appAlert('danger', {msg: 'You are in the guild already'});
                        return;
                    }
                    if (!model.get('guild_id') || model.get('guild_id') != view.model.get('id')) {
                        Utils.appAlert('danger', {msg: 'Request not found'});
                        return;
                    }
                    $.ajax({
                        url: 'api/users/' + model.get('id') + '/leave_guild',
                        type: 'PUT',
                        success: () => {
                            Utils.appAlert('success', {msg: 'Request canceled'});
                            view.render();
                        },
                        error: (response) => {
                            Utils.alertOnAjaxError(response);
                        }
                    });
                },
                error: Utils.alertOnAjaxError
            });
        },
        leave:  function() {
            let name = this.model.get('name');
            let view = this;
            this.cur_user.fetch({
                success: function (model) {
                    if (model.get('guild_id') != view.model.get('id')) {
                        Utils.appAlert('danger', {msg: 'You are not a member of ' + name});
                        return;
                    }
                    $.ajax({
                        url: 'api/users/' + model.get('id') + '/leave_guild',
                        type: 'PUT',
                        success: () => {
                            Utils.appAlert('success', {msg: 'You left the guild ' + name});
                            view.render();

                        },
                        error: (response) => {
                            Utils.alertOnAjaxError(response);
                        }
                    });
                },
                error: Utils.alertOnAjaxError
            });
        },
        accept: function() {
            Utils.accept_guild_invite(this.model.get('id'), this.model.get('name'));
            this.render();
        },
        decline:  function() {
            Utils.decline_guild_invite('current', this.model.get('id'), this.model.get('name') + '\'s request declined');
            this.render();
        },
        declareWar:  function() {
            $.ajax({
                url: 'api/wars/',
                type: 'POST',
                data: {
                    guild2_id: this.model.get('id'),
                    stake: 0 //take all other from form
                },
                success: () => {
                    Utils.appAlert('success', {msg: 'You declared war to the ' + this.model.get('name')});
                    //this.render();
                },
                error: (response) => {
                    Utils.alertOnAjaxError(response);
                }
            });
        }
    });

    GuildsView.View = Backbone.View.extend({
        cur_user: new Users.CurrentUserModel,
        template1: _.template($('#guilds-template').html()),
        template2: _.template($('#guilds-template-create').html()),
        events: {
            "click #refresh-button" :   "refresh",
            "submit #create-guild": "createGuild"
        },
        initialize: function () {
            this.cur_user.fetch({reset: true, error: this.onFetchError});
            this.collection = new Guilds.GuildCollection;
            this.listenTo(this.cur_user.model, 'change', this.render);
            this.listenTo(this.collection, 'change', this.render);
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.collection.fetch({reset: true, error: this.onFetchError});
        },
        addOne: function (guild) {
            guild.view = new GuildsView.SingleGuildView({model: guild});
            this.el.append(guild.view.render().el);
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
        createGuild: function(e) {
            e.preventDefault();
            e.stopPropagation();
            name = $('#newGuildName').val().trim()
            $.ajax({
                url: 'api/guilds/',
                type: 'POST',
                data: `name=${name}`,
                success: (result) => {
                    Utils.appAlert('success', {msg: 'Guild ' + name + ' has been created'});
                    this.collection.fetch({
                        error: this.onFetchError});
                    MainSPA.SPA.router.navigate("#/guilds/" + result.id);// + "/edit"
                },
                error: (response) => {
                    Utils.alertOnAjaxError(response);
                }
            });
        },
        render: function () {
            let view = this;
            this.cur_user.fetch({
                success: function (model) {
                    if (model.get('guild_accepted'))
                        view.$el.html(view.template1());
                    else
                        view.$el.html(view.template2());
                    view.addAll();
                    },
                error: function () {
                    view.$el.html(view.template2());
                    view.addAll();
                }
            });
            return this;
        }
    });

    GuildsView.ProfileView = Backbone.View.extend({
        cur_user : new Users.CurrentUserModel,
        template1: _.template($('#guild-profile-template').html()),
        template2: _.template($('#guild-edit-master-template').html()),
        template3: _.template($('#guild-edit-officer-template').html()),
        events: {
            "click #refresh-button" :   "refresh",
            "keypress #anagram" : "updateOnEnter",
            "click #delete-button" : "delete_guild"
        },
        initialize: function (id) {
            this.model = new Guilds.GuildId({id: id});
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
            let view = this;
            let id = this.model.get('id');
            this.cur_user.fetch({
                success: function (model) {
                    if (model.get('guild_id') == id) {
                        if (model.get('guild_master'))
                            view.$el.html(view.template2(view.model.toJSON()));
                        else if (model.get('guild_officer'))
                            view.$el.html(view.template3(view.model.toJSON()));
                        else
                            view.$el.html(view.template1(view.model.toJSON()));
                    }
                    else
                        view.$el.html(view.template1(view.model.toJSON()));
                },
                error: function () {
                    view.$el.html(view.template1(view.model.toJSON()));
                }
            });
            return this;
        },
        delete_guild : function () {
            $.ajax({
                url: 'api/guilds/' + this.model.id,
                type: 'DELETE',
                success: () => {
                    Utils.appAlert('success', {msg: 'Guild ' + name + ' has been deleted'});
                    MainSPA.SPA.router.navigate("#/guilds");
                },
                error: (response) => {
                    Utils.alertOnAjaxError(response);
                }
            });
        },
        updateOnEnter: function (e) {
            if (e.keyCode !== 13) return;
            let newanagram = $('#anagram').val().trim();
            let view = this;
            if (this.model.get('anagram') !== newanagram) {
                e.preventDefault();
                e.stopPropagation();
                this.model.save({anagram: newanagram},
                    {patch: true,
                        success: function () {
                            Utils.appAlert('success', {msg: 'Anagram has been changed'});},
                        error: function (model, response) {
                            Utils.alertOnAjaxError(response);
                            model.attributes = model.previousAttributes();
                            view.render();
                        }
                    });
            }
        }
    });

    GuildsView.GuildInvitationView = Backbone.View.extend({
        //cur_user: new Users.CurrentUserModel,
        template: _.template($('#guild-template-invite').html()),
        events: {
            "click #accept-button": "accept",
            "click #decline-button": "decline"
        },
        tagName: "div",
        initialize: function (/*user*/) {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'error', this.onerror);
           // this.u_id = user.id;
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        accept:  function() {
            Utils.accept_guild_invite(this.model.get('id'), this.model.get('name'));
            this.remove();
        },
        decline:  function() {
            Utils.decline_guild_invite('current', this.model.get('id'), this.model.get('name') + '\'s request declined');
            this.remove();
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

    GuildsView.GuildInvitationsView = Backbone.View.extend({
        template: _.template($('#guilds-template').html()),
        events: {
            "click #refresh-button" :   "refresh"
        },
        initialize: function (id) {
            this.collection = new Guilds.GuildInvitationsCollection([], {id: id});
            this.listenTo(this.collection, 'change', this.render);
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.collection.fetch({reset: true, error: this.onerror});
            this.u_id = id;
        },
        addOne: function (guild) {
            guild.view = new GuildsView.GuildInvitationView({model: guild, id: this.u_id});
            this.el.append(guild.view.render().el);
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

export default GuildsView;
