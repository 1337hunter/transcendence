class Api::GuildsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :check_in_other_guild, only: [:create, :join]

  def index
    @guilds = Guild.all
    render json: @guilds
  end

  def create
    puts "Creating new guild"
    anagram = params[:name]
    if anagram.length > 5
      first = anagram[0]
      anagram[0] = ''
      anagram = anagram.delete("aeiou ")
      anagram = first + anagram[0,4]
      #check uniqueness?
    end
    guild = Guild.new(name: params[:name], anagram: anagram)
    if guild.save
      current_user.guild_id = guild.id
      current_user.guild_master = true
      current_user.save
      render json: guild, status: :ok
    else
      render json: guild.errors, status: :unprocessable_entity
    end
  end

  def show
    @guild = Guild.find(params[:id])
    render json: Guild.clean(@guild)
  end

  def destroy
    @guild.destroy
    respond_to do |format|
      format.html { redirect_to "/#guilds", notice: 'Guild was successfully deleted.' }
      format.json { head :no_content }
    end
  end

  def check_in_other_guild
    if current_user.guild_id
      current_user.errors.add :base, 'You are in the guild already. Leave your guild to continue'
      render json: current_user.errors, status: :bad_request
    end
  end
end
