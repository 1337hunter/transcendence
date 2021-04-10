class UserValidator < ActiveModel::Validator
  def validate(record)
    record.displayname = record.displayname.strip
    record.errors.add :displayname, 'Displayname is shorter than 2 symbols' if record.displayname.size < 2
    record.errors.add :displayname, 'Displayname is longer than 20 symbols' if record.displayname.size > 20
    record.errors.add :displayname, 'Special symbols are not allowed' unless record.displayname.match? '^[a-zA-Z0-9 ]+$'

    @badnames = ['nil', 'null', 'drop table;']
    record.errors.add :displayname, 'Bad displayname' if @badnames.include? record.displayname.downcase
  end
end
