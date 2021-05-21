class Api::DirectRoomsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :authenticate_user!

    def index
        @direct_room = DirectRoom.where("sender_id = ? OR receiver_id = ?", current_user.id, current_user.id)
        render json: @direct_room
    end

    def create
        if DirectRoom.between(params[:sender_id], params[:receiver_id]).present?
            @direct_room = DirectRoom.between(params[:sender_id], params[:receiver_id]).first
        else
            @direct_room = DirectRoom.create!(direct_room_params)
        end
    end

    private
        def direct_room_params
            params.permit(:sender_id, :receiver_id)
        end

  end