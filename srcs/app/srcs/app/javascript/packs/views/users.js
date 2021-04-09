import Backbone from "backbone";
import _ from "underscore";
import UserCollection from "../models/users";
import app_alert from "../helpers/app_alert";

const UsersView = {};

$(function () {
	UsersView.SingleUserView = Backbone.View.extend({
        template: _.template($('#singleuser-template').html()),
        events: {
            "keypress #displayname" : "updateOnEnter"
        },
        tagName: "tr",
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'error', this.onerror);
        },
        updateOnEnter: function (e) {
            if (e.keyCode !== 13) return;

            let newdisplayname = $('#displayname').val();
            if (this.model.get('displayname') !== newdisplayname)
            {
                e.preventDefault();
                e.stopPropagation();
                this.model.save({displayname: newdisplayname},
                    {patch: true, success: this.onsuccess});
            }
        },
        onerror: function (model, response) {
            response.responseJSON.base.forEach(errmsg =>
                app_alert('danger', errmsg));
            this.model.attributes = this.model.previousAttributes();
            this.render();
        },
        onsuccess: function () {
            app_alert('success', 'Displayname has been changed');
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

	UsersView.View = Backbone.View.extend({
		template: _.template($('#users-template').html()),
		events: {
		    "click #refresh-button" :   "refresh"
        },
		initialize: function () {
		    this.collection = new UserCollection;
		    this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
//          this.listenTo(this.collection, 'sync', this.render);
            this.collection.fetch({error: this.onerror});
        },
		addOne: function (user) {
            let view = new UsersView.SingleUserView({model: user});
            this.$("tbody").append(view.render().el);
        },
        addAll: function () {
            this.collection.each(this.addOne, this);
        },
        refresh: function () {
            this.collection.fetch({
                success: function () {app_alert('success', 'Up to date');},
                error: this.onerror});
        },
        onerror: function (model, response) {
		    app_alert('danger', 'Users fetch from API failed');
        },
		render: function () {
			this.$el.html(this.template());
			this.addAll();
			return this;
		}
	});
});

export default UsersView;
