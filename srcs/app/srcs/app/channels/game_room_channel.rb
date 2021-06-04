class GameRoomChannel < ApplicationCable::Channel
  @users = []
  def subscribed
    puts "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    puts params
    stream_from "game_room_channel_#{params[:match_id]}"
  #  ActionCable.server.broadcast("game_room_channel_#{params[:match_id]}", "start")
  end

  def receive(data)
  #  puts data
    ActionCable.server.broadcast("game_room_channel", data)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
