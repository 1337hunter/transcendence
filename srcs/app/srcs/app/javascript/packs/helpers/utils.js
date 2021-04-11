import MainSPA from "../main_spa";

export default class Utils {
    // replaces avatar with default from db
    // if default from db is unavailable - replaces to common default
    // if common default is unavailable - element is removed
    static replaceavatar (elem, model) {
        if ($(elem).attr('src') === "/assets/avatar_default.jpg")
            $(elem).remove();
        else {
            let replacesrc = model.get('avatar_default_url');
            if ($(elem).attr('src') === replacesrc)
                replacesrc = "/assets/avatar_default.jpg";
            $(elem).attr("src", replacesrc);
        }
        return true;
    }

    static capitalizeFirstLetter(string) {
        return string[0].toUpperCase() + string.slice(1);
    }

    static app_alert(type, options) {
        if (options['msg'])
            MainSPA.SPA.app_alerts.addOne(type, Utils.capitalizeFirstLetter(options['msg']));
        if (options['json'])
            Object.values(options['json']).forEach((val) =>
                val.toString().split(',').forEach((msg) =>
                    Utils.app_alert('danger', {msg: msg})));
    };
}
