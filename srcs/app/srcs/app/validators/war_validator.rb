class WarValidator < ActiveModel::Validator
  def validate(record)
    if record.start < (DateTime.now + 1.0/24.0)
      record.errors.add :start, 'Start date and time is earlier than 1 hour in future'
    end
    if record.end < (record.start + 1.0)
      record.errors.add :start, 'The gap between start and date must be not less then 24 hours'
    end
    # TODO: wartime_start wartime_end (1h gap)
    record.errors.add :stake, 'Stake must be not less then 1 point' if record.stake < 1
    record.errors.add :max_unanswered, 'Max numbers of unanswered calls must be not less then 1' if record.max_unanswered < 1
    record.errors.add :wait_minutes, 'Wait time must be from 10 to 1440 min' if record.wait_minutes < 10 || record.wait_minutes > 1440
  end

end