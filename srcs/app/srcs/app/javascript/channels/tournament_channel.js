import consumer from "./consumer"
import MainSPA from "../packs/main_spa";
import Backbone from "backbone";
import GameRoomInit from "./game_room_channel"
import Users from "../packs/models/users";
import Utils from "../packs/helpers/utils";

var TournamentChannel = 
{
  Subscribe: function (params) {
    const TournamentRoom = consumer.subscriptions.create({channel: "TournamentChannel", tournament_id: params.tournament_id}, {
      initialized() {
        var $this = this
        $(document).ready(function(){
          $this.tornament_id = params.tournament_id;
          $this.current_user_id = MainSPA.SPA.router.currentuser.get('id');
        });
      },
      connected() {
        console.log("connected to Tournament id: " + this.tornament_id)
        // Called when the subscription is ready for use on the server
      },

      disconnected() {
        console.log("disconnected from Tournament id: " + this.tornament_id) // it work but don't print
        // Called when the subscription has been terminated by the server
      },
      Disconnect: function () {
        consumer.subscriptions.remove(this)
      },
      received(data) {
        var self = this
        console.log(data)
        if (data == "start") {
            MainSPA.SPA.router.navigate("#/play/" + this.match_id);
        }
        for (var i = 0; i < data.matches.length; ++i)
        {
          if (data.matches[i][0].user_id == this.current_user_id || data.matches[i][1].user_id == this.current_user_id) { /*DELETE SECOND CONDITION! */
            this.Match = new Users.TournamentMatchModel({
              first_player_id: data.matches[i][0].user_id,
              second_player_id: data.matches[i][1].user_id,
            })
            this.Match.fetch({
              success: function () {
                self.Match.set(self.Match, {game_room: GameRoomInit.createGameRoom({match_id: self.Match.attributes.id})});
                  self.match_id = self.Match.attributes.id
              }
            })
          }
        }
      }
    });
    return TournamentRoom;
  }

}

export default TournamentChannel