class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    puts "#{current_user.displayname} is online"
    current_user.touch(:last_seen_at)
    current_user.update(online: true)
  end

  def unsubscribed
    puts "#{current_user.displayname} is offline"
    current_user.touch(:last_seen_at)
    current_user.update(online: false)
    # Any cleanup needed when channel is unsubscribed
  end
end
