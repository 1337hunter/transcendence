import Backbone from "backbone";
import _ from "underscore";
import Guilds from "../models/guilds";
import Users from "../models/users";
import Utils from "../helpers/utils";
import MainSPA from "../main_spa";
import moment from "moment";
import UsersView from "./users";
import Admin from "../models/admin";
import AdminView from "./admin";

const GuildsView = {};

$(function () {
    GuildsView.SingleGuildView = Backbone.View.extend({
        cur_user: new Users.CurrentUserModel,
        template1: _.template($('#guild-template-other').html()),
        template2: _.template($('#guild-template-leave').html()),
        template3: _.template($('#guild-template-join').html()),
        template4: _.template($('#guild-template-other-war').html()),
        events: {
            "click #join-button": "join",
            "click #leave-button": "leave",
            "click #master" : "masterProfile",
            "click #guild-profile" : "guildProfile"
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
                    else
                        view.$el.html(view.template3(view.model.toJSON()));
                }});
            return this;
        },
        guildProfile: function () {
            /*let id = this.model.get('id');
            this.cur_user.fetch({
                success: function (model) {
                    if (model.get('guild_id') == id && (model.get('guild_master') || model.get('guild_officer')))
                        MainSPA.SPA.router.navigate("#/guilds/" + id + "/edit");
                    else
                        MainSPA.SPA.router.navigate("#/guilds/" + id);
                }});*/
            MainSPA.SPA.router.navigate("#/guilds/" + this.model.get('id'));
        },
        masterProfile:  function () {
            MainSPA.SPA.router.navigate("#/users/" + this.model.get('master_id'));
        },
        join:  function() {
           let view = this;
            this.cur_user.fetch({
                success: function (model) {
                    if (model.get('guild_accepted')) {
                        Utils.appAlert('danger', {msg: 'You are in the guild already'});
                        return;
                    }
                    model.save({guild_id: view.model.id}, {
                            patch: true,
                            success: function () {
                                Utils.appAlert('success', {msg: 'Request to ' + view.model.get('name') + ' sent'});
                            },
                            onerror: view.onerror
                    });
                    view.render();
                    },
                error: view.onerror
            });

            //tmp for test
           //let view = this;
            /*this.cur_user.fetch({
                success: function (model) {
                    $.ajax({
                        url: 'api/users/' + model.get('id') + '/add',
                        type: 'PUT',
                        data: `guild_accepted=${true}`,
                        success: () => {
                            Utils.appAlert('success', {msg: 'You joined the guild ' + view.model.get('name')});
                            //view.render();
                        },
                        error: (response) => {
                            Utils.alertOnAjaxError(response);
                        }
                    });
                },
                error: view.onerror
            });*/

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
                        url: 'api/users/' + model.get('id') + '/leave',
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
                error: view.onerror
            });
        },
        onerror: function (model, response) {
            if (response.responseJSON == null) //  true for undefined too
                Utils.appAlert('danger', {msg: 'No response from API'});
            else
                Utils.appAlert('danger', {json: response.responseJSON});
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
            this.cur_user.fetch();
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
            Utils.appAlert('danger', {msg: 'Guilds fetch from API failed'});
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
            if (this.model.get('anagram') !== newanagram)
            {
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
        cur_user: new Users.CurrentUserModel,
        template: _.template($('#guild-template-invite').html()),
        events: {
            "click #accept-button": "accept",
            "click #decline-button": "decline",
            "click #master" : "masterProfile",
            "click #guild-profile" : "guildProfile"
        },
        tagName: "div",
        initialize: function (user) {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'error', this.onerror);
            this.u_id = user.id;
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        guildProfile: function () {
            MainSPA.SPA.router.navigate("#/guilds/" + this.model.get('id'));
        },
        masterProfile:  function () {
            MainSPA.SPA.router.navigate("#/users/" + this.model.get('master_id'));
        },
        accept:  function() {
            $.ajax({
                url: 'api/users/' + this.u_id + '/add',
                type: 'PUT',
                data: `guild_id=${this.model.get('id')}`,
                success: () => {
                    Utils.appAlert('success', {msg: this.model.get('name') + '\'s request accepted'});
                    this.deleteAll(); //delete all invitations?
                    this.guildProfile();
                },
                error: (response) => {
                    Utils.alertOnAjaxError(response);
                }
            });
        },
        decline:  function() {
            $.ajax({
                url: 'api/users/' + this.u_id + '/guild_invitations/' + $.param({"user_id": this.u_id, "guild_id" : this.model.get('id')}),
                type: 'DELETE',
                success: () => {
                    Utils.appAlert('success', {msg: this.model.get('name') + '\'s request declined'});
                    //remove view?
                },
                error: (response) => {
                    Utils.alertOnAjaxError(response);
                }
            });
        },
        deleteAll:  function() {
            $.ajax({
                url: 'api/users/' + this.u_id + '/guild_invitations/' + $.param({"user_id": this.u_id}),
                type: 'DELETE',
                success: () => {
                    Utils.appAlert('success', {msg: 'Other requests declined'});
                },
                error: (response) => {
                    Utils.alertOnAjaxError(response);
                }
            });
        },
        onerror: function (model, response) {
            if (response.responseJSON == null) //  true for undefined too
                Utils.appAlert('danger', {msg: 'No response from API'});
            else
                Utils.appAlert('danger', {json: response.responseJSON});
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
