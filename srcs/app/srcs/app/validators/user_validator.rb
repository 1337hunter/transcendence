class UserValidator < ActiveModel::Validator
  def validate(record)
    @badnames = ['nil', 'null', 'drop table;']
    record.errors.add :base, 'Displayname is shorter than 2 symbols' if record.displayname.size < 2
    record.errors.add :base, 'Displayname is longer than 20 symbols' if record.displayname.size > 20
    record.errors.add :base, 'Bad displayname' if @badnames.include? record.displayname.downcase
  end
end
