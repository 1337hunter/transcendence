class GameRoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "game_room_channel"
  end

  def receive(data)
    puts data
    ActionCable.server.broadcast("game_room_channel", data)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
