import Backbone from "backbone";
import _ from "underscore";
import Guilds from "../models/guilds";
import Utils from "../helpers/utils";

const GuildsView = {};

$(function () {
    GuildsView.SingleGuildView = Backbone.View.extend({
        template: _.template($('#guild-template').html()),
        events: {
        },
        tagName: "div",
        initialize: function () {
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
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
            this.collection.fetch({reset: true, error: this.onerrorFetch});
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
                error: this.onerrorFetch});
        },
        onerrorFetch: function () {
            Utils.appAlert('danger', {msg: 'Guilds fetch from API failed'});
        },
        createGuild: function(e) {
            e.preventDefault();
            e.stopPropagation();
            //this.model.unset("errors")
            this.model = new this.collection.model();
            this.collection.create({name: $('#newGuildName').val()},
                {success: this.onCreateSuccess, error: this.onCreateError});
        },
        onCreateError: function (model, response) {
            Utils.alertOnAjaxError(response);
            model.destroy();
        },
        onCreateSuccess: function () {
            Utils.appAlert('success', {msg: 'Guild has been created'});
        },
        render: function () {
            this.$el.html(this.template());
            this.addAll();
            return this;
        }
    });
});

export default GuildsView;
