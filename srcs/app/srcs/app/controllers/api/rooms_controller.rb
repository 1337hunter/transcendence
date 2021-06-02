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
        render json: @room, status: :ok
    end

    def update
        if (params.has_key?(:verify_password))
            @room = Room.find(params[:id])
            if @room.present? && @room.authenticate(params[:password])
                render json: @room, status: :ok
            else
                render json: {error: "Wrong password", status: 400},  status: 400
            end
        else
            @room = Room.new
            if (params.has_key?(:name))
                @room.name = params[:name]
                if params.has_key?(:password) && params[:password] != ""
                    @room.password_present = true
                    @room.password = params[:password]
                else
                    @room.password_present = false
                end
                @room.owner_id = current_user.id
                @room.owner_name = current_user.displayname
                @room.private = params[:private]
                @room.save
                render json: @room, status: :ok
            end
        end
    end
end
