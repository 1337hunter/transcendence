class UserValidator < ActiveModel::Validator
  def validate(record)
    @badnames = ['nil', 'null', 'drop table;']
    record.errors.add :base, 'Bad displayname' if @badnames.include? record.displayname.downcase
  end
end
