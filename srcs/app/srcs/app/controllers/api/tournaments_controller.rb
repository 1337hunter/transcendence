class Api::TournamentsController < ApplicationController
  include ApplicationHelper
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  before_action :check_2fa!
  before_action :sign_out_if_banned
  before_action :check_admin, only: %i[create destroy open close begin finish]
  before_action :find_tournament, only: %i[show destroy join leave open close begin finish]
  before_action :define_filters
  rescue_from ActiveRecord::RecordNotFound, :with => :tournament_not_found

  def index
    render json: Tournament.all.as_json(
      include: {users: {only: @filters}, winner: {only: @filters}}
    )
  end

  def show
    render json: @tournament
                   .as_json(include: {users: {only: @filters}, winner: {only: @filters}})
                   .merge({:is_current_admin => current_user.owner? || current_user.admin?,
                           :is_in_tournament => current_user.tournament_id == @tournament.id})
  end

  # POST /api/tournaments/
  def create
    @tournament.create!(start_date: params[:start_date], end_date: [:end_date])
  end

  # DELETE /api/tournaments/id/
  def destroy
    @tournament.users.each { |user| user.update(tournament_id: nil) }
    @tournament.destroy
    render json: { error: 'Tournament has been destroyed' }, status: :ok
  end

  # POST /api/tournaments/id/join
  def join
    unless @tournament.open?
      render json: { error: 'Registration to tournament is closed' }, status: :forbidden
      return
    end
    unless current_user.tournament_id.nil?
      render json: { error: 'You are registered to another tournament' }, status: :forbidden
      return
    end
    current_user.update(tournament_id: @tournament.id)
    render json: { msg: "Successfully joined tournament ##{@tournament.id}" }, status: :ok
  end

  # POST /api/tournaments/id/leave
  def leave
    if @tournament.active?
      render json: { error: 'You cant unregister from active tournament' }, status: :forbidden
      return
    end
    if current_user.tournament_id == @tournament.id
      current_user.update(tournament_id: nil)
      render json: { msg: "Successfully left tournament ##{@tournament.id}" }, status: :ok
    end
  end

  # POST /api/tournaments/id/open
  def open
    if @tournament.active? || @tournament.finished?
      render json: { error: 'You cant reopen registration to active or finished tournament' }, status: :forbidden
      return
    end
    @tournament.open! unless @tournament.open?
    render json: { msg: "Registration to tournament ##{@tournament.id} opened" }, status: :ok
  end

  # POST /api/tournaments/id/close
  def close
    if @tournament.active? || @tournament.finished?
      render json: { error: 'You cant close registration to active or finished tournament' }, status: :forbidden
      return
    end
    @tournament.closed! unless @tournament.closed?
    render json: { msg: "Registration to tournament ##{@tournament.id} closed" }, status: :ok
  end

  # POST /api/tournaments/id/begin
  def begin
    if @tournament.finished?
      render json: { error: 'You cant begin finished tournament' }, status: :forbidden
      return
    end
    @tournament.active! unless @tournament.active?
    render json: { msg: "Tournament ##{@tournament.id} has begun" }, status: :ok
  end

  # POST /api/tournaments/id/finish
  def finish
    unless @tournament.active?
      render json: { error: 'You must start tournament to finish it' }, status: :forbidden
      return
    end
    @tournament.finished! unless @tournament.finished?
    render json: { msg: "Tournament ##{@tournament.id} finished" }, status: :ok
  end

  private

  def find_tournament
    @tournament = Tournament.find(params[:id])
  end

  def tournament_not_found
    render json: {error: 'Tournament not found'}, status: :not_found
  end

  def check_admin
    render json: {error: "You have no permission"}, status: :forbidden unless current_user.owner? || current_user.admin?
  end

  def define_filters
    @filters = %i[id displayname admin banned online last_seen_at
                  nickname wins loses elo avatar_url avatar_default_url]
  end

  # this is for later
  def json_params_for(objects)
    collection = objects.map do |post|
      {
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        status: "reviewed"
      }
    end
    collection.to_json
  end
end
