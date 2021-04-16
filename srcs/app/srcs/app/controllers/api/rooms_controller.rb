class Api::RoomsController < ApplicationController
    before_action :authenticate_user!
    skip_before_action :verify_authenticity_token

    def index
        @rooms = Room.all
        render json: @rooms
    end

    def create
    end

    def update
        @room = Room.new
        if (params.has_key?(:name))
            @room.name = params[:name]
            render json: @room, status: :ok
        end
        @room.save
    end

end
