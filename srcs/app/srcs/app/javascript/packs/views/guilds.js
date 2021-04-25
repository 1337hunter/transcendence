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
                success: function () {Utils.app_alert('success', {msg: 'Up to date'});},
                error: this.onerrorFetch});
        },
        onerrorFetch: function () {
            Utils.app_alert('danger', {msg: 'Guilds fetch from API failed'});
        },
        createGuild: function(e) {
            e.preventDefault();
            e.stopPropagation();
            //this.model.unset("errors")
            this.model = new this.collection.model();
            this.collection.create({name: $('#newGuildName').val()});
            this.refresh()
        },
        onerror: function (model, response) {
            if (response.responseJSON == null) //  true for undefined too
                Utils.app_alert('danger', {msg: 'No response from API'});
            else
                Utils.app_alert('danger', {json: response.responseJSON});
            this.model.attributes = this.model.previousAttributes();
            this.render();
        },
        onsuccess: function () {
            Utils.app_alert('success', {msg: 'Guild has been created'});
        },
        render: function () {
            this.$el.html(this.template());
            this.addAll();
            return this;
        }
    });
});

export default GuildsView;