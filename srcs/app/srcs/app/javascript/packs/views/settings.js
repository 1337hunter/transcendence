import Backbone from "backbone";
import _ from "underscore";

const SettingsView = {};

$(function () {
	SettingsView.View = Backbone.View.extend({
		template: _.template($('#settings-template').html())
	});
});

export default SettingsView;