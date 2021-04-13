import Backbone from "backbone";
import _ from "underscore";

const RoomsView = {};

$(function () {
	RoomsView.View = Backbone.View.extend({
		initialize: function () {
			
		},
		template: _.template($('#rooms-template').html()),
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

export default RoomsView;