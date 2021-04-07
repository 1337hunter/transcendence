import Backbone from "backbone";
import _ from "underscore";

const SettingsView = {};

$(function () {
	SettingsView.View = Backbone.View.extend({
		template: _.template($('#settings-template').html()),
		events: {},
		initialize: function () {
			this.listenTo(this.model, 'sync', this.onsync);
			this.fetched = false;
			this.model.fetch();
		},
		onsync: function () {
			this.fetched = true;
			this.render();
		},
		render: function () {
			if (this.fetched === true)
				this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});
});

export default SettingsView;
