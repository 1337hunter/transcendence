class ChatChannel < ApplicationCable::Channel

  def subscribed
    stream_from "chat_room"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    # possible cleanup below
    # stop_stream_from "chat_room"
  end
end
