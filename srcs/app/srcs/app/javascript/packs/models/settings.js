import Backbone from "backbone";
import _ from "underscore";

let SettingsModel = Backbone.Model.extend({
    url: '/api/settings',
});

export default SettingsModel;
