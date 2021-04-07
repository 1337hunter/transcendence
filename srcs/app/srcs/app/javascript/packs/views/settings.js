import Backbone from "backbone";
import _ from "underscore";

const SettingsView = {};

$(function () {
	SettingsView.View = Backbone.View.extend({
		template: _.template($('#settings-template').html()),
		events: {},
		render: function () {
			this.$el.html(this.template());
			return this;
		}
	});
});

export default SettingsView;
