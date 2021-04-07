import Backbone from "backbone";
import _ from "underscore";

const SettingsView = {};

$(function () {
	SettingsView.View = Backbone.View.extend({
		template: _.template($('#settings-template').html()),
		tagName: "ul",
		events: {},
		initialize: function () {
			this.model.fetch();
			this.listenTo(this.model, 'sync', this.render);
			
			//this.listenTo(this.model, 'reset', this.addAll);
			
		},
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});
});

export default SettingsView;
