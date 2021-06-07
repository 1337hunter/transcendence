class Api::TournamentsController < ApplicationController
  include ApplicationHelper
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  before_action :check_2fa!
  before_action :sign_out_if_banned
  before_action :find_tournament, only: %i[show update destroy]
  rescue_from ActiveRecord::RecordNotFound, :with => :tournament_not_found

  def index
    @tournaments = Tournament
                     .all
                     .includes(:users)
    render json: @tournaments
  end

  def show
    render json: @tournament
  end

  def update
  end

  def create
  end

  def delete
  end

  private

  def find_tournament
    @tournament = Tournament.find(params[:id])
  end

  def tournament_not_found
    render json: {error: 'Tournament not found'}, status: :not_found
  end
end
