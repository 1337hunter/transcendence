import Backbone from "backbone";
import _ from "underscore";
import UserCollection from "../models/users";

const UsersView = {};

$(function () {
	UsersView.SingleUserView = Backbone.View.extend({
        template: _.template($('#singleuser-template').html()),
        events: {},
        tagName: "tr",
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

	UsersView.View = Backbone.View.extend({
		template: _.template($('#users-template').html()),
		events: {},
		initialize: function () {
		    this.collection = new UserCollection;
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'sync', this.render);
            this.collection.fetch();
        },
		addOne: function (user) {
            let view = new UsersView.SingleUserView({model: user});
            this.$("tbody").append(view.render().el);
        },
        addAll: function () {
            this.collection.each(this.addOne, this)
        },
		render: function () {
			this.$el.html(this.template());
			this.addAll();
			return this;
		}
	});
});

export default UsersView;
