class Api::RoomsController < ApplicationController
    skip_before_action :verify_authenticity_token

    def index
        @rooms = Room.all
        render json: @rooms
    end

    def create
    end

    def update
        @room = Room.new
        if (params.has_key?(:name))
            @room.name = params[:name]#.update(displayname: params[:displayname])
            puts ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
            puts params[:name]
            puts "<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
            
            # if params[:name] == 123:
            #     @room.errors.add :base, 'You have no permission'
            #     render json: @room.errors, status: :forbidden
            # else
            render json: @room, status: :ok
            # end
        end
        @room.save
    end

end
