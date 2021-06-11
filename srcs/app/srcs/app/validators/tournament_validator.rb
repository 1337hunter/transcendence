class TournamentValidator < ActiveModel::Validator
  def validate(record)
    if record.start_date.nil? || record.end_date.nil?
      return
    end

    # validate date
    if record.start_date < (DateTime.now + 1.0/24.0)
      record.errors.add :start_date, "Start date and time is earlier than 1 hour in future"
    end
  end
end
