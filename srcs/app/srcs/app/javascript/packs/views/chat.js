import Backbone from "backbone";
import _ from "underscore";

const ChatView = {};

$(function () {
	ChatView.View = Backbone.View.extend({
		template: _.template($('#chat-template').html()),
		events: {},
		render: function () {
			this.$el.html(this.template());
			return this;
		}
	});
});

export default ChatView;