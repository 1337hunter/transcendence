class Api::MessagesController < ApplicationController
    skip_before_action :verify_authenticity_token


    def index
        @messages = Message.all
        render json: @messages
    end

    def create
        @message = Message.create(room_id: params["room_id"],
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

    def show
        @messages = Message.where(room_id: params[:id]).
          includes(:user).
          joins(:user).
          select([
                   Message.arel_table[Arel.star],
                   User.arel_table[:displayname],
                   User.arel_table[:avatar_url].as("avatar"),
                   User.arel_table[:avatar_default_url]
                 ])
        render json: @messages
    end

    private

    def message_params
        params.require(:message).permit(:content, :room_id)
    end
end
