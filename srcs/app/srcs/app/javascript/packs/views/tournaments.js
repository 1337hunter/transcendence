import Backbone from "backbone";
import _ from "underscore";
import Tournaments from "../models/tournaments";
import Utils from "../helpers/utils";
import MainSPA from "../main_spa";

const TournamentsView = {};

$(function () {
    TournamentsView.SingleTournamentView = Backbone.View.extend({
        template: _.template($('#singletournament-template').html()),
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
            this.$("#tournaments-table").append(tournament.view.render().el);
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

    TournamentsView.PageView = Backbone.View.extend({
        template: _.template($('#tournamentpage-template').html()),
        events: {
            "click #refresh-button"             :   "refresh",
            "click .join-tournament-button"     :   "join",
            "click .leave-tournament-button"    :   "leave"
        },
        initialize: function (id) {
            this.model = new Tournaments.ModelById({id: id})
            this.listenTo(this.model, 'change', this.render);
            this.model.fetch({error: this.onerror});
        },
        refresh: function () {
            this.model.fetch({
                success: function () {
                    Utils.appAlert('success', {msg: 'Up to date'});
                    },
                error: this.onerror});
        },
        join: function () {
            Utils.ajax(`api/tournaments/${this.model.get('id')}/join`,'POST')
                .then((data) => {
                    Utils.appAlert('success', {json: data});
                    this.model.fetch();
                    }, this.onerror
                );
        },
        leave: function () {
            Utils.ajax(`api/tournaments/${this.model.get('id')}/leave`,'POST')
                .then((data) => {
                    Utils.appAlert('success', {json: data});
                    this.model.fetch();
                    }, this.onerror
                );
        },
        onerror: function (model, response) {
            if (response == null && model?.responseJSON != null) {
                Utils.alertOnAjaxError(model);
                return;
            }
            Utils.alertOnAjaxError(response);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            if (this.registredusersview == null)
                this.registredusersview = new TournamentsView.UsersView();
            this.$("#registredusers").html(
                this.registredusersview.render(this.model.attributes.users).el);
            return this;
        }
    });

    TournamentsView.SingleUserView = Backbone.View.extend({
        template: _.template($('#single-tournament-user-template').html()),
        events: {
            "click" : "openprofile",
        },
        tagName: "tr",
        openprofile: function () {
            MainSPA.SPA.router.navigate("#/users/" + this.model.get('id'));
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            let model = this.model;
            this.$('.user_icon').on("error",
                function () { Utils.replaceAvatar(this, model); });
            return this;
        }
    });

    TournamentsView.UsersView = Backbone.View.extend({
        template: _.template($('#tournament-users-template').html()),
        addOne: function (user) {
            user.view = new TournamentsView.SingleUserView({model: user});
            this.$("#tournament-users-table").append(user.view.render().el);
        },
        addAll: function () {
            this.collection.each(this.addOne, this);
        },
        render: function (users) {
            this.collection = new Backbone.Collection(users);
            this.$el.html(this.template({usercount: this.collection.length}));
            this.addAll();
            return this;
        }
    });
});

export default TournamentsView;
