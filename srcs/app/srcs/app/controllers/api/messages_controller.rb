class Api::MessagesController < ApplicationController
    skip_before_action :verify_authenticity_token


    def index
        @messages = Message.all
        render json: @messages
    end

    def create
        @block = BlockUserRoom.where(room_id: params["room_id"]).select("user_id").as_json
        if !(@block.any? {|h| h["user_id"] == current_user.id})
            @message = Message.create(room_id: params["room_id"],
                                    content: params["content"],
                                    user: current_user)
            ActionCable.server.broadcast("room_#{@message.room_id}", 
            {
                user_id: @message.user_id,
                room_id: @message.room_id,
                room_owner_id: params[:owner_id],
                avatar: current_user.avatar_url,
                displayname: current_user.displayname,
                content: params['content'],
                block: @block
            })
            render json: @message
        end
    end

    def show
        @admin = RoomAdmin.where(room_id: params[:id], user_id: current_user.id)
        @messages = Message.where(room_id: params[:id]).
          includes(:user).
          joins(:user).
          select([
                   Message.arel_table[Arel.star],
                   User.arel_table[:displayname],
                   User.arel_table[:avatar_url].as("avatar"),
                   User.arel_table[:avatar_default_url]
                 ]).as_json
        render json: @messages
    end

    private

    def message_params
        params.require(:message).permit(:content, :room_id)
    end

end
