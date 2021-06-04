class Api::RoomMembersController < ApplicationController
    skip_before_action :verify_authenticity_token

    def index
    end

    def update
    end

    def create
        if BlockUserRoom.where(user_id: params[:user_id], room_id: params[:room_id]).blank?
            @block = BlockUserRoom.new
            @block.user_id = params[:user_id]
            @block.time = params[:time]
            @block.room_id = params[:room_id]
            @block.save
        end
    end

    def show
    end
end
