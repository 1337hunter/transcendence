class AddGuildIdToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :guild_id, :integer
  end
end
