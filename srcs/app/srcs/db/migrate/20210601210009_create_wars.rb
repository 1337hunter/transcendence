class CreateWars < ActiveRecord::Migration[6.1]
  def change
    create_table :wars do |t|
      t.references :guild1, null: false
      t.references :guild2, null: false
      t.boolean :finished, default: false
      t.boolean :accepted, default: false
      t.datetime :start
      t.datetime :end
      t.integer :stake
      t.integer :g1_score, default: 0
      t.integer :g2_score, default: 0
      t.datetime :wartime_start
      t.datetime :wartime_end
      t.integer :wait_minutes, default: 10
      t.integer :max_unanswered, default: 5
      t.integer :matches_total, default: 0
      t.integer :g1_matches_won, default: 0
      t.integer :g1_matches_unanswered, default: 0
      t.integer :g2_matches_won, default: 0
      t.integer :g2_matches_unanswered, default: 0
      t.boolean :ladder, default: false
      t.boolean :tournament, default: false
      t.boolean :duel, default: false
      t.integer :winner

      t.timestamps
    end
    add_foreign_key :wars, :guilds, column: :guild1_id, primary_key: :id
    add_foreign_key :wars, :guilds, column: :guild2_id, primary_key: :id
  end
end
