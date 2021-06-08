class Api::TournamentsController < ApplicationController
  include ApplicationHelper
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  before_action :check_2fa!
  before_action :sign_out_if_banned
  before_action :check_admin, only: %i[create update destroy]
  before_action :find_tournament, only: %i[show update destroy]
  before_action :define_filters
  rescue_from ActiveRecord::RecordNotFound, :with => :tournament_not_found

  def index
    render json: Tournament.all.as_json(include: {users: {only: @filters}})
  end

  def show
    render json: @tournament.as_json(include: {users: {only: @filters}})
  end

  def update

  end

  def create
    @tournament.create!(start_date: DateTime.now + 365)
  end

  def destroy
    @tournament.users.each { |user| user.update(tournament_id: nil) }
    @tournament.destroy
  end

  def register_to_tournament

  end

  def unregister_from_tournament

  end

  private

  def find_tournament
    @tournament = Tournament.find(params[:id])
  end

  def tournament_not_found
    render json: {error: 'Tournament not found'}, status: :not_found
  end

  def check_admin
    render json: {error: "You have no permission"}, status: :forbidden unless current_user.admin?
  end

  def define_filters
    @filters = %i[id displayname admin banned online last_seen_at
                  nickname wins loses elo avatar_url avatar_default_url]
  end
end
