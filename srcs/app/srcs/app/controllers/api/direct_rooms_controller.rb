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

    def show
        @room = DirectRoom.where("sender_id = ? OR receiver_id = ?", current_user.id, current_user.id).first
        if current_user.id == @room.receiver_id
            @user_id = @room.sender_id
        else
            @user_id = @room.receiver_id
        end
        @user = User.find(@user_id)
        puts ">>>>>>>>>>>>>>>>>>>>>"
        puts show_room
        puts ">>>>>>>>>>>>>>>>>>>>>"
        render json: show_room
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

    def show_room
        {
            id: @room.id,
            receiver_id: @room.receiver_id,
            sender_id: @room.sender_id,
            receiver_name: @user.displayname
        }
    end

  end