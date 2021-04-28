class GuildValidator < ActiveModel::Validator
  def validate(record)
    # define bad names
    @badnames = ['nil', 'null', 'drop table;']

    # validate name
    record.name = record.name.strip
    record.errors.add :name, 'name is shorter than 3 symbols' if record.name.size < 3
    record.errors.add :name, 'name is longer than 20 symbols' if record.name.size > 20
    record.errors.add :name, 'Special symbols are not allowed' unless record.name.match? '^[a-zA-Z0-9 ]+$'
    record.errors.add :name, 'Bad name' if @badnames.include? record.name.downcase

    # validate anagram
    record.anagram = record.anagram.strip
    record.errors.add :anagram, 'Bad name' if @badnames.include? record.anagram.downcase

  end

end

