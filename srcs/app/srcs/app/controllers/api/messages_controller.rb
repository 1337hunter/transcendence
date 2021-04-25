class Api::MessagesController < ApplicationController
    skip_before_action :verify_authenticity_token

    def index
        @messages = Message.all
        render json: @messages
    end

    def create
        @message = Message.new(message_params)
        @message.user = current_user
        @message.save
        ActionCable.server.broadcast("chat_room", { body: params['content'] })
    end

    private
    
    def message_params
        params.require(:message).permit(:content)
    end
end