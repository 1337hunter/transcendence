class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    puts "#{current_user.displayname} is online"
  end

  def unsubscribed
    puts "#{current_user.displayname} is offline"
    # Any cleanup needed when channel is unsubscribed
  end
end
