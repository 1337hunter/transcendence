import Backbone from "backbone";
import _ from "underscore";

const SettingsView = {};

$(function () {
	SettingsView.View = Backbone.View.extend({
		template: _.template($('#settings-template').html()),
		events: {},
		initialize: function () {
			this.el = $("#app_main");
			this.listenTo(this.model, 'sync', this.render);
			this.model.fetch();
		},
		render: function () {
			this.el.html(this.template(this.model.toJSON()));
//			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});
});

export default SettingsView;
