class Api::GuildsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :define_user_filters, only: %i[show_members]
  before_action :check_in_other_guild, only: [:create]
  before_action :find_guild, only: %i[show update destroy show_master show_officers show_members show_requests]
  before_action :check_master_rights, only: [:destroy, :update]
  before_action :check_officer_rights, only: [:show_requests]
  rescue_from ActiveRecord::RecordNotFound, :with => :guild_not_found

  def index
    @guilds = Guild.all.includes(:master).joins(:master).
      select([
               Guild.arel_table[Arel.star],
               User.arel_table[:displayname].as("master_name"),
               User.arel_table[:id].as("master_id")
             ])
    render json: @guilds
  end

  def show
    render json: @guild
  end

  def create
    puts "Creating new guild"
    guild = @user.create_guild(name: params[:name],
                               anagram: generate_anagram(params[:name]))
    if guild.save
      @user.guild_master = true
      @user.guild_accepted = true
      @user.save
      render json: guild, status: :ok
    else
      render json: guild.errors, status: :unprocessable_entity
    end
  end

  def update
    if @guild.update(guild_params)
      render json: @guild, only: @filters, status: :ok
    else
      render json: @guild.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @guild.has_active_war
      render json: {error: "You have a war in progress"}, status: :forbidden
    end
    @guild.members.each { |member|
      member.guild_accepted = false
      member.guild_officer = false
      member.guild_master = false
      member.save
    }
    @guild.destroy
  end

  def users_available
    @users = User.all.where(:guild_accepted => false)
    #@users = @users.all.where.not(:banned => true)
    # @users = @users.all.where.not(:id => current_user.id)
    render json: @users, only: @filters, status: :ok
  end

  #delete?
  def  show_master
    @master = @guild.master
    render json: @master, only: @filters, status: :ok
  end
  #delete?
  def  show_officers
    @officers = @guild.officers
    render json: @officers, only: @filters, status: :ok
  end
  #delete?
  def show_soldiers
    @soldiers = @guild.soldiers
    render json: @soldiers, only: @filters, status: :ok
  end

  def show_members
    @users = @guild.members
    render json: @users, only: @filters, status: :ok
  end

  def show_requests
    @users = @guild.requests
    render json: @users, only: @filters, status: :ok
  end

  private

  def find_guild
    @guild = Guild.find(params[:id])
  end

  def guild_not_found
    render json: {error: 'Guild not found'}, status: :not_found
  end

  def check_in_other_guild
    @user = current_user
    if (@user.guild_id && @user.guild_accepted)
      @user.errors.add :base, 'You are in the guild already. Leave your guild to continue.'
      render json: @user.errors, status: :bad_request
    end
  end

  def check_master_rights
    check_member
    if @user.guild_master = false
        @user.errors.add :base, 'No permission'
        render json: @user.errors, status: :forbidden
    end
  end

  def check_officer_rights
    check_member
    if @user.guild_officer = false &&  @user.guild_master = false
      @user.errors.add :base, 'No permission'
      render json: @user.errors, status: :forbidden
    end
  end

  def check_member
    @user = current_user
    if (@user.guild_id != @guild.id || !@user.guild_accepted)
      @user.errors.add :base, 'No permission'
      render json: @user.errors, status: :forbidden
    end
  end

  # Only allow a list of trusted parameters through.
  def guild_params
    params.require(:guild).permit(%i[anagram]) #+name?
  end

  def define_user_filters
    @filters = %i[id nickname displayname email admin banned online last_seen_at
                  wins loses elo avatar_url avatar_default_url
                  guild_id guild_master guild_officer guild_accepted]
  end

  def generate_anagram(name)
    charset = "aeiouAEIOU "
    name = name.delete(" ")
    if name.length < 6 && !Guild.find_by(anagram: name)
      return name
    end
    if name.length < 6
      tmp = cut_entry(name[0,5].clone)
      if !tmp.empty?
        return tmp
      end
    end
    anagram = name[1, name.size]
    anagram = anagram.delete(charset)
    anagram = name[0] + anagram[0,4]
    same = Guild.find_by(anagram: anagram)
    if !same
      return anagram
    end
    samename = same.name
    str_a = name.delete(charset)
    str_b = samename.delete(charset)
    if str_a == str_b
      str_a = name
      str_b = samename
    end
    i = str_a.each_char.with_index.find_index {|char, idx| char != str_b[idx] } || -1
    if i == -1
      if (len = name.size) > anagram.size
        while len
          len -= 1
          if anagram.size < 5
            anagram += name[len]
          else
            anagram[anagram.size - 1] = name[len]
          end
          if check_anagram(anagram)
            return anagram
          end
        end
      end
      tmp = cut_entry(anagram.clone)
      if !tmp.empty?
        return tmp
      end
      else
        last = anagram.size - 1
        if i < last
        anagram = anagram[0, i] + str_a[i] + anagram[i + 1, 4]
        else
          if last < 4
            last += 1
          end
        anagram[last] = str_a[i]
        end
    end
    while !check_anagram(anagram)
      charset = name.split('') + Array('0'..'9') + %w[_@#$*^%><~+/.!)]
      add = anagram.size
      if add > 4
        add -= 1
      end
      anagram[add] = charset.sample
    end
    return anagram
  end

  def cut_entry(entry)
    cut = entry
    loop do
      cut.upcase!
      if check_anagram(cut)
        return cut
      end
      cut.downcase!
      if check_anagram(cut)
        return cut
      end
      cut[cut.size - 1] = ''
      break if cut.size < 2
      if check_anagram(cut)
        return cut
      end
    end
    return ""
  end

  def check_anagram(a)
    if Guild.find_by(anagram: a) || %w[nill null NILL NULL].include?(a)
      return false
    else
      return true
    end
  end

end
