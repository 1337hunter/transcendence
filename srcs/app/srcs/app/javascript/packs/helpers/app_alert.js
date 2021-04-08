import MainSPA from "../main_spa";

export default function app_alert(type, msg) {
    MainSPA.SPA.app_alerts.addOne(type, msg);
};
