import consumer from "./consumer"

var rightPadX;
var rightPadY;

var GameRoomInit = 
{
    $this: this,
    createGameRoom: function ($this) {
        const GameRoom = consumer.subscriptions.create("GameRoomChannel", {
            connected() {
            // Called when the subscription is ready for use on the server
                console.log("Connected to game room channel");
            },

            disconnected() {
              // Called when the subscription has been terminated by the server
            },

            received(data) {
                rightPadX = data.x;
                rightPadY = data.y;
            }
      });
      return GameRoom;
    }
}
export {rightPadX, rightPadY};
export default GameRoomInit;