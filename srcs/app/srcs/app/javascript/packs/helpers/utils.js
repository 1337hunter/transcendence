import MainSPA from "../main_spa";

export default class Utils {
    // replaces avatar with default from db
    // if default from db is unavailable - replaces to common default
    // if common default is unavailable - element is removed
    static replaceAvatar (elem, model) {
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

    static appAlert(type, options) {
        if (options['msg'])
            MainSPA.SPA.app_alerts.addOne(type, Utils.capitalizeFirstLetter(options['msg']));
        if (options['json'])
            Object.values(options['json']).forEach((val) =>
                val.toString().split(',').forEach((msg) =>
                    Utils.appAlert(type, {msg: msg})));
    };

    static alertOnAjaxError(response) {
        if (response.responseJSON == null)  //  true for undefined too
            Utils.appAlert('danger', {msg: 'No response from API'});
        else
            Utils.appAlert('danger', {json: response.responseJSON});
    }

    static ajax(url, http, data) {
        return new Promise(((resolve, reject) => {
            $.ajax(url, {
                type: http,
                data: data,
                headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')}
            }).done(resolve).fail(reject);
        }));
    }
}
