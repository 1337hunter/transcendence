class GameRoomChannel < ApplicationCable::Channel
  def subscribed
    puts "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    puts params
    stream_from "game_room_channel#{params[:room_id]}"
  end

  def receive(data)
  #  puts data
    ActionCable.server.broadcast("game_room_channel", data)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
