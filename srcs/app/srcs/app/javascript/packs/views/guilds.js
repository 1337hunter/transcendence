import Backbone from "backbone";
import _ from "underscore";
import Guilds from "../models/guilds";
import Users from "../models/users";
import Utils from "../helpers/utils";

const GuildsView = {};

$(function () {
    GuildsView.SingleGuildView = Backbone.View.extend({
        cur_user: new Users.CurrentUserModel,
        template: _.template($('#guild-template').html()),
        events: {
            "click #join-button": "join"
        },
        tagName: "div",
        initialize: function () {
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        join:  function() {
            let view = this;
            this.cur_user.fetch({
                success: function (model) {
                    model.save({guild_id: view.model.id}, {
                            patch: true,
                            success: view.onJoinSuccess(),
                            onerror: view.onerror
                    });
                },
                error: view.onerror
            });
        },
        onJoinSuccess: function () {
            Utils.appAlert('success', {msg: 'You joined the guild ' + this.model.get('name')});
        },
        onerror: function (model, response) {
            if (response.responseJSON == null) //  true for undefined too
                Utils.appAlert('danger', {msg: 'No response from API'});
            else
                Utils.appAlert('danger', {json: response.responseJSON});
           // cur_user.attributes = cur_user.previousAttributes();
           // this.render();
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
                success: () => {
                    Utils.appAlert('success', {msg: 'Guild ' + name + ' has been created'});
                    this.collection.fetch({
                        error: this.onFetchError});
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
});

export default GuildsView;
