class Api::GuildsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :check_in_other_guild, only: [:create, :update]
  before_action :find_guild, only: %i[show update destroy leave show_master show_officers show_soldiers]
  #before_action :check_member, only: [:leave]
  before_action :check_master_rights, only: [:destroy]
  before_action :check_officer_rights, only: [:update]

  def index
    @guilds = Guild.all
    render json: @guilds
  end

  def show
    render json: @guild
  end

  def create
    puts "Creating new guild"
    guild = @user.create_guild(name: params[:name], anagram: generate_anagram(params[:name]))
    if guild.save
      @user.guild_master = true
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

  #delete?
  def leave
    if @user.guild_master = true
      @user.errors.add :base, 'Pass master role before leaving the guild.'
      #redirect to members list ?
      render json: @user.errors, status: :forbidden
    end
    @user.guild_id = nil
    @user.guild_officer = false
    @user.save
  end

  def destroy
    @guild.members.each { |member|
      member.guild_id = nil
      member.guild_officer = false
      member.guild_master = false
      member.save
    }
    @guild.destroy
    respond_to do |format|
      format.html { redirect_to "/#guilds", notice: 'Guild was successfully deleted.' }
      format.json { head :no_content }
    end
  end

  def users_available
    @users = User.all.where(:guild_id => nil)
    @users = @users.all.where.not(:banned => true)
    @users = @users.all.where.not(:id => current_user.id)
    render json: @users, status: :ok
  end

  def  show_master
    @master = guild.master
    render json: @master, status: :ok
  end

  def  show_officers
    @officers = guild.officers
    render json: @officers, status: :ok
  end

  def show_soldiers
    @soldiers = guild.soldiers
    render json: @soldiers, status: :ok
  end

  def show_members
    @members = guild.members
    render json: @members, status: :ok
  end

  private

  def find_guild
    @guild = Guild.find(params[:id])
  end

  def check_in_other_guild
    @user = current_user
    if @user.guild_id
      @user.errors.add :base, 'You are in the guild already. Leave your guild to continue.'
      render json: @user.errors, status: :bad_request #uncomment! commented for test
    end
  end

  def chek_master_rights
    check_member
    if @user.guild_master = false
        @user.errors.add :base, 'Only Guild master can do it'
        render json: @user.errors, status: :forbidden
    end
  end

  def check_officer_rights
    check_member
    if @user.guild_officer = false &&  @user.guild_master = false
      @user.errors.add :base, 'You should be the master or an officer for this action'
      render json: @user.errors, status: :forbidden
    end
  end

  def check_member
    @user = current_user
    if @user.guild_id != @guild.id
      @user.errors.add :base, 'You are not in this guild'
      render json: @user.errors, status: :forbidden
    end
  end

  # Only allow a list of trusted parameters through.
  def guild_params
    params.require(:guild).permit(%i[name anagram])
  end

  def generate_anagram(name)
    charset = "aeiouAEIOU "
    if name.length < 6 && !Guild.find_by(anagram: name)
      return name
    end
    name = name.delete(" ")
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
