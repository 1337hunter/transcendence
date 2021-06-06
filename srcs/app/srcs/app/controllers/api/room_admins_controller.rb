class Api::RoomAdminsController < ApplicationController
    before_action :authenticate_user!
    skip_before_action :verify_authenticity_token

    def index
    end

    def show
        if RoomAdmin.where(room_id: params[:id], user_id: current_user.id).blank?
            render json: {admin: false}, status: :ok
        else
            render json: {admin: true}, status: :ok
        end
    end

    def create
    end

    def update
        RoomAdmin.create(room_id: params[:id], user_id: params[:user_id])
        render json: [], status: :ok
    end

end
