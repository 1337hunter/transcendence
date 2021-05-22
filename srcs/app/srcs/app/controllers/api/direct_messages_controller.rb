class Api::DirectMessagesController < ApplicationController
    skip_before_action :verify_authenticity_token

    def index
        @messages = DirectMessage.where(id: params[:id])
        render json: @messages
    end

    def show
        @messages = DirectMessage.where(id: params[:id])
        render json: @messages
    end

    def create
        @message = Message.create(direct_room_id: params["room_id"],
                                  content: params["content"],
                                  user: current_user)
        ActionCable.server.broadcast("room_#{@message.room_id}", 
        {
            user_id: @message.user_id,
            room_id: @message.room_id,
            avatar: current_user.avatar_url,
            displayname: current_user.displayname,
            content: params['content'] 
        })
        render json: @message
    end
end
