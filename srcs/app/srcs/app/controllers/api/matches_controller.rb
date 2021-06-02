class Api::MatchesController < ApplicationController
    before_action :authenticate_user!
    skip_before_action :verify_authenticity_token

    def index
        @matches = Match.where("first_player_id = ? OR second_player_id = ?", params[:user_id], params[:user_id])
        render json: @matches, status: :ok
    end

    def show
        puts "show action"
    end

    def update
        @match = Match.find(params[:id])
        if (params.has_key?(:status))
            @match.update(status: params[:status])
        end
        render json: [], status: :ok
    end

    def create
        if find_invitation(params[:user_id], params[:invited_user_id], 1) or find_invitation(params[:invited_user_id], params[:user_id], 1)
            render json: {error: 'Invitation already exists'}, status: :unprocessable_entity
        else
            @match = Match.create(player_one: User.find(params["user_id"]),
                                player_two: User.find(params["invited_user_id"]),
                                status: 1)
            puts 'MATCH CREATED'
            render json: @match, status: :ok
        end
    end

    def destroy
        Match.find(params[:id]).destroy
        render json: [], status: :ok
    end

    private

    def find_invitation(first_player_id, second_player_id, status)
        if first_player_id == 'current'
          first_player_id = current_user.id
        end
        return Match.find_by_first_player_id_and_second_player_id_and_status(first_player_id, second_player_id, status)
    end
end
