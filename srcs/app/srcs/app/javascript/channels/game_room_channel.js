import consumer from "./consumer"

var GameRoomInit = 
{
    GameRoom: async function () {
        const Room = consumer.subscriptions.create("GameRoomChannel", {
        connected() {
          // Called when the subscription is ready for use on the server
          console.log("Connected to game room channel");
        },
      
        disconnected() {
          // Called when the subscription has been terminated by the server
        },
      
        received(data) {
            console.log(data);
          // Called when there's incoming data on the websocket for this channel
        }
    });
    return Room;
  }
}
export default GameRoomInit;