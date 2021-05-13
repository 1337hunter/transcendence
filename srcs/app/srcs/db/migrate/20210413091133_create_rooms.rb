class CreateRooms < ActiveRecord::Migration[6.1]
  def change
    create_table :rooms do |t|
      t.string      :name
      t.string      :password
      t.string      :owner_name
      t.string      :owner_id
      t.boolean     :private
      t.timestamps
    end
  end
end
