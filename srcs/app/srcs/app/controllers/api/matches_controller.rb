class Api::MatchesController < ApplicationController
    before_action :authenticate_user!
    skip_before_action :verify_authenticity_token

    def show
    end

end