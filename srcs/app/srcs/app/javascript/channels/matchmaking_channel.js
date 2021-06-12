import consumer from "./consumer"
import MainSPA from "../packs/main_spa";

var MatchmakingInit = 
{
  connectToChannel: function (id) {
    consumer.subscriptions.create("MatchmakingChannel", {
      connected() {
        // Called when the subscription is ready for use on the server
        console.log("Connected to the matchmaking channel");
        this.send({action: "start", id: MainSPA.SPA.router.currentuser.get('id')});
      },
    
      disconnected() {
        // Called when the subscription has been terminated by the server
        console.log("Disconnected from the matchmaking channel");
      },
    
      received(data) {
        // Called when there's incoming data on the websocket for this channel
        console.log("recieved data from matchmaking channel: ", data);
        if (data.action == "start")
        {
          if (data.id == MainSPA.SPA.router.currentuser.get('id'))
          {
            console.log("it's me");
          }
        }
      }
    });
  }
}

export default MatchmakingInit;