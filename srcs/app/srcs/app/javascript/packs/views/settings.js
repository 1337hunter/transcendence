import Backbone from "backbone";
import _ from "underscore";

const SettingsView = {};

$(function () {
	SettingsView.View = Backbone.View.extend({
		template: _.template($('#settings-template').html()),
		events: {},
		initialize: function () {
			this.listenTo(this.model, 'reset', this.addAll);
			this.listenTo(this.model, 'sync', this.render);
			this.model.fetch();
		},
		render: function () {
			this.$el.html(this.template());
			return this;
		}
	});
});

export default SettingsView;
