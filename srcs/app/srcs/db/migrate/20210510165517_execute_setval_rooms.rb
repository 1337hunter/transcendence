class ExecuteSetvalRooms < ActiveRecord::Migration[6.1]
  def change
    execute "SELECT setval('rooms_id_seq', 4)"
  end
end
