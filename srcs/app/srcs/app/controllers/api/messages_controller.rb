class Api::MessagesController < ApplicationController
    skip_before_action :verify_authenticity_token

    def create
        ActionCable.server.broadcast("chat_room", { body: params['content'] })
    end
end