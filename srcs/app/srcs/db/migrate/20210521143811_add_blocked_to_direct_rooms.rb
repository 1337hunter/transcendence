class AddBlockedToDirectRooms < ActiveRecord::Migration[6.1]
  def change
    add_column :direct_rooms, :blocked, :boolean
  end
end
