class GameRoomChannel < ApplicationCable::Channel
  def subscribed
    puts params
    
    stream_from "game_room_channel_#{params[:match_id]}"
    if current_user.id == Match.find(params[:match_id]).second_player_id
      start_match
    end
  end

  def receive(data)
    puts "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    puts data
    puts params
    ActionCable.server.broadcast("game_room_channel_#{params[:match_id]}", data)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private
  def start_match
    ActionCable.server.broadcast("game_room_channel_#{params[:match_id]}", "start")
  end
end
