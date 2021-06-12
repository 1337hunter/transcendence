import consumer from "./consumer"
import MainSPA from "../packs/main_spa";
import GameRoomInit from "./game_room_channel"

var TournamentChannel = 
{
  Subscribe: function (params) {
    const TournamentRoom = consumer.subscriptions.create({channel: "TournamentChannel", tournament_id: params.tournament_id}, {
      initialized() {
        this.tornament_id = params.tournament_id;
        this.current_user_id = MainSPA.SPA.router.currentuser.get('id');
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
        console.log(data)
      }
    });
    return TournamentRoom;
  }

}

export default TournamentChannel