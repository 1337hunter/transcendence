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
}
