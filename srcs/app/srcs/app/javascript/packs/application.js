// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import * as ActiveStorage from "@rails/activestorage"
import "channels"
let $ = require("jquery");
let _ = require("underscore");
let Backbone = require("backbone");

import MainSPA from "./main_spa";

Rails.start()
ActiveStorage.start()
window._ = _;

// load on DOM ready
$(function () {
    new MainSPA;
});
