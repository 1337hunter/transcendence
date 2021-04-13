import Backbone from "backbone";
import _ from "underscore";

const ChatView = {};

$(function () {
	ChatView.View = Backbone.View.extend({
		initialize: function () {
			
		},
		template: _.template($('#chat-template').html()),
		events: {},
		render: function () {
			this.$el.html(this.template());
			var $this = this;
			_.defer(function(){
  				$this.$('#chat-input').focus();
			});
			return this;
		}
	});
});

export default ChatView;