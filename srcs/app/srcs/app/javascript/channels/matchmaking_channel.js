import consumer from "./consumer"
import MainSPA from "../packs/main_spa";
import Pong from "../packs/models/pong"
import Users from "../packs/models/users"


var MatchmakingInit = 
{
  connectToChannel: function (id) {
    consumer.subscriptions.create("MatchmakingChannel", {
      connected() {
        // Called when the subscription is ready for use on the server
        console.log("Connected to the matchmaking channel");
        this.send({action: "find", id: MainSPA.SPA.router.currentuser.get('id')});
      },
    
      disconnected() {
        // Called when the subscription has been terminated by the server
        console.log("Disconnected from the matchmaking channel");
      },
    
      received(data) {
        // Called when there's incoming data on the websocket for this channel
        console.log("recieved data from matchmaking channel: ", data);
        if (data.action == 'find')
        {
          if (data.id != MainSPA.SPA.router.currentuser.get('id'))
          {
            this.send({action: "confirm", id: MainSPA.SPA.router.currentuser.get('id')});
          }
        }
        if (data.action == 'confirm')
        {
          if (data.id != MainSPA.SPA.router.currentuser.get('id'))
          {
            let $this = this;
            this.match = new Pong.MatchModel();
            this.match.save({success: function (model) {
              console.log(model)
           //   $this.match.fetch({success: function () {
           //     console.log($this.match.attributes.id);
           //   }});
            }});
          }
        }
      }
    });
  }
}

export default MatchmakingInit;