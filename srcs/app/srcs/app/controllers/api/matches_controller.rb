class Api::MatchesController < ApplicationController
    before_action :authenticate_user!
    skip_before_action :verify_authenticity_token

    def index
        puts "by my shaggy bark"
        puts params
    end

    def show
        puts "show action"
    end

end