import Backbone from "backbone";
import _ from "underscore";
import Utils from "../helpers/utils";

const MessagesView = {};

$(function () {
	MessagesView.View = Backbone.View.extend({
		template: _.template($('#message-template').html()),
		events:{
		},
        render: function () {
			this.$el.html(this.template());
			return this;
		}
	});
});

export default MessagesView