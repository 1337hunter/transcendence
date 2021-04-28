class Api::GuildsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :check_in_other_guild, only: [:create, :update]
  before_action :find_guild, only: %i[show update destroy leave]
  before_action :check_member, only: [:leave]
  before_action :check_master_rights, only: [:destroy]

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

  private

  def find_guild
    @guild = Guild.find(params[:id])
  end

  def check_in_other_guild
    @user = current_user
    if @user.guild_id
      @user.errors.add :base, 'You are in the guild already. Leave your guild to continue.'
      # render json: @user.errors, status: :bad_request #uncomment! commented for test
    end
  end

  def chek_master_rights
    check_member
    if @user.guild_master = false
        @user.errors.add :base, 'You are not the master of this guild'
        render json: @user.errors, status: :forbidden
    end
  end

  def check_member
    @user = current_user
    if @user.guild_id != @guild.id
      @user.errors.add :base, 'You are not in this guild'
      render json: @user.errors, status: :bad_request
    end
  end

  def generate_anagram(name)
    if name.length < 6 && !Guild.find_by(anagram: name)
      return name
    end
    if !Guild.find_by(anagram: name[0,5])
      return name[0,5]
    end
    if !Guild.find_by(anagram: name[0,3])
      return name[0,3]
    end
    if !Guild.find_by(anagram: name[0,2])
      return name[0,2]
    end
    anagram = name[1, name.size]
    anagram = anagram.delete("aeiou ")
    anagram = name[0] + anagram[0,4]
    same = Guild.find_by(anagram: anagram)
    if !same
      return anagram
    end
    samename = same.name
    str_a = name.delete("aeiou ")
    str_b = samename.delete("aeiou ")
    if str_a == str_b
      str_a = name
      str_b = samename
    end
    i = str_a.each_char.with_index.find_index {|char, idx| char != str_b[idx] } || -1
    if i == -1
      cut = anagram
      loop do
        cut.upcase!
        if !Guild.find_by(anagram: cut)
          return cut
        end
        cut.downcase!
        if !Guild.find_by(anagram: cut)
          return cut
        end
        cut.delete(cut.size - 1)
        break if cut.size < 2
        if !Guild.find_by(anagram: cut)
          return cut
        end
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
    unless !Guild.find_by(anagram: anagram)
      charset = name.split('') + Array('0'..'9') + %w[_@#$*^%><~+/.]
      add = anagram.size
      if add > 4
        add -= 1
      end
      anagram[add] = charset.sample
    end
    return anagram
  end

end
