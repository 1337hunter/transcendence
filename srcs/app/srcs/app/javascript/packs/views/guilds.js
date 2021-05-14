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
        template: _.template($('#guild-template').html()),
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
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        guildProfile: function () {
            MainSPA.SPA.router.navigate("#/guilds/" + this.model.get('id'));
        },
        masterProfile:  function () {
            MainSPA.SPA.router.navigate("#/users/" + this.model.get('master_id'));
        },
        join:  function() {
            let view = this;
            this.cur_user.fetch({
                //check in guild?
                success: function (model) {
                    model.save({guild_id: view.model.id}, {
                            patch: true,
                            success: function () {
                                Utils.appAlert('success', {msg: 'You joined the guild ' + view.model.get('name')});
                            },
                            onerror: view.onerror
                    });
                },
                error: view.onerror
            });
        },
        leave:  function() {
            let view = this;
            this.cur_user.fetch({
                //check in guild?
                success: function (model) {
                    model.save({guild_id: null, guild_officer: false}, {
                        patch: true,
                        success: function () {
                            Utils.appAlert('success', {msg: 'You left the guild ' + view.model.get('name')});
                        },
                        onerror: view.onerror
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
        template: _.template($('#guilds-template').html()),
        events: {
            "click #refresh-button" :   "refresh",
            "submit #create-guild": "createGuild"
        },
        initialize: function () {
            this.collection = new Guilds.GuildCollection;
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
                    MainSPA.SPA.router.navigate("#/guilds/" + result.id);
                },
                error: (response) => {
                    Utils.alertOnAjaxError(response);
                }
            });
        },
        render: function () {
            this.$el.html(this.template());
            this.addAll();
            return this;
        }
    });

    GuildsView.ProfileView = Backbone.View.extend({
        template: _.template($('#guild-profile-template').html()),
        events: {
            "keypress #anagram" : "updateOnEnter",
            "click #refresh-button" :   "refresh"
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
        },
        onerror: function (model, response) {
            Utils.alertOnAjaxError(response);
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
});

export default GuildsView;
