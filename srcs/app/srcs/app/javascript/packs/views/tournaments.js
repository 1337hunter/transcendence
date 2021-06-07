import Backbone from "backbone";
import _ from "underscore";
import Tournaments from "../models/tournaments";
import Utils from "../helpers/utils";
import MainSPA from "../main_spa";

const TournamentsView = {};

$(function () {
    TournamentsView.PageView = Backbone.View.extend({
        template: _.template($('#tournamentpage-template').html()),
        initialize: function (id) {
            this.model = new Tournaments.ModelById({id: id})
            this.listenTo(this.model, 'change', this.render);
            this.model.fetch({error: this.onerror});
        },
        onerror: function (model, response) {
            Utils.alertOnAjaxError(response);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    TournamentsView.SingleTournamentView = Backbone.View.extend({
        template: _.template($('#singletournament-template').html()),
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
            MainSPA.SPA.router.navigate("#/tournaments/" + this.model.get('id'));
        },
        onerror: function (model, response) {
            Utils.alertOnAjaxError(response);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    TournamentsView.View = Backbone.View.extend({
        template: _.template($('#tournaments-template').html()),
        events: {
            "click #refresh-button" :   "refresh"
        },
        initialize: function () {
            this.collection = new Tournaments.Collection;
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.collection.fetch({reset: true, error: this.onerror});
        },
        addOne: function (tournament) {
            tournament.view = new TournamentsView.SingleTournamentView({model: tournament});
            this.$("#users-table").append(tournament.view.render().el);
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

export default TournamentsView;
