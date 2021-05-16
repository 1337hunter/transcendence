class Api::RoomsController < ApplicationController
    before_action :authenticate_user!
    skip_before_action :verify_authenticity_token

    def index
        @rooms = Room.all
        render json: @rooms
    end

    def create
    end

    def show
        @room = Room.where(id: params[:id])
        render json: @room
    end

    def update
        @room = Room.new
        if (params.has_key?(:name))
            @room.name = params[:name]
            @room.password = params[:password]
            @room.private = params[:is_private]
            @room.save
            render json: @room, status: :ok
        end
    end
end
