class Api::DirectRoomsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :authenticate_user!

    def index
        @ret = []
        @direct_room = (DirectRoom.where("sender_id = ? OR receiver_id = ?", current_user.id, current_user.id))
        @direct_room.each do |dr|
            if dr.receiver_id == current_user.id
                @user = User.where(id: dr.sender_id).first
            else
                @user = User.where(id: dr.receiver_id).first
            end
            @ret << get_concat(dr)
        end
        render json: @ret
    end

    def create
        if DirectRoom.between(params[:sender_id], params[:receiver_id]).present?
            @direct_room = DirectRoom.between(params[:sender_id], params[:receiver_id]).first
        else
            @direct_room = DirectRoom.create!(direct_room_params)
        end
        render json: [],  status: :ok
    end

    private

    def get_concat(dr)
        avatar = @user.avatar_url != nil ? @user.avatar_url : @user.avatar_default_url
        {
            id: dr.id,
            receiver_id: dr.receiver_id,
            sender_id: dr.sender_id,
            blocked: dr.blocked,
            user_name: @user.displayname,
            avatar: avatar
        }
    end
    
    def direct_room_params
        {
            sender_id: params[:sender_id],
            receiver_id: params[:receiver_id],
            blocked: false
        }
    end

  end