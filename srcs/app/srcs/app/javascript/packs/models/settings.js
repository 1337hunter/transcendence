import Backbone from "backbone";

let SettingsModel = Backbone.Model.extend({
    urlRoot: '/api/settings',
});

export default SettingsModel;
