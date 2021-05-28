class Api::MatchesController < ApplicationController
    before_action :authenticate_user!
    skip_before_action :verify_authenticity_token

    def index
        puts "by my shaggy bark"
        @matches = Match.where("first_player_id = ? OR second_player_id = ?", params[:user_id], params[:user_id])
        render json: @matches, status: :ok
    end

    def show
        puts "show action"
    end

    def create
        @match = Match.create(player_one: User.find(params["user_id"]),
                              player_two: User.find(params["invited_user_id"]),
                              status: 1)
        puts 'MATCH CREATED'
        render json: @match, status: :ok
    end
end
