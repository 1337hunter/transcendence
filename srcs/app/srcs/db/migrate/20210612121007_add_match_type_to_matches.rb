class AddMatchTypeToMatches < ActiveRecord::Migration[6.1]
  def change
    add_column :matches, :type, :integer
  end
end
