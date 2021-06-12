class MatchmakingChannel < ApplicationCable::Channel
  def subscribed
    stream_from "matchamking_channel"
  end

  def receive

  end

  def start
    ActionCable.server.broadcast("matchmaking_channel", "i can process this")
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
