import Backbone from "backbone";
import _ from "underscore";
import SettingsModel from "../models/settings";

const SettingsView = {};

$(function () {
	SettingsView.View = Backbone.View.extend({
		template: _.template($('#settings-template').html()),
		events:{
			'blur input#email' : 'input',
			'blur input#displayname' : 'input'
		},
		initialize: function () {
			this.model = new SettingsModel;
			this.fetched = false;
			this.listenTo(this.model, 'sync', this.onsync);
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
		},
		input: function (input)
		{
			this.model.save({displayname: $('#displayname').val().trim(), email: $('#email').val().trim()});
		}
	});
});

export default SettingsView;
