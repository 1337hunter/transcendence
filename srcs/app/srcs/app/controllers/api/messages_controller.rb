class Api::MessagesController < ApplicationController
    skip_before_action :verify_authenticity_token


    def index
        @messages = Message.all
        render json: @messages
    end

    def create
        @admins = RoomAdmin.where(room_id: params["room_id"]).select("user_id").as_json
        @blocks = BlockUserRoom.where(room_id: params["room_id"]).select("user_id").as_json
        if !(@blocks.any? {|h| h["user_id"] == current_user.id})
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
                block_svg: File.join(Rails.root, 'app', 'assets', 'images', 'block.svg'),
                blocks: @blocks,
                admins: @admins
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
# ActionCable.server.broadcast("room_2", 
#             {
#                 user_id: 2,
#                 room_id: 2,
#                 room_owner_id: 6,
#                 admin: true,
#                 avatar: "https://www.pexels.com/photo/close-up-photography-of-group-of-people-974320/",
#                 displayname: "dummy",
#                 content: "message",
#                 block: {} 
#             })