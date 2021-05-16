import consumer from "./consumer"

var obtainedValues = 
{
	rigthPadX: 1,
	rightPadY: 1,
	leftPadX: 1,
	leftPadY: 1
}

var GameRoomInit = 
{
<<<<<<< HEAD
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
=======
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
                obtainedValues.rightPadX = data.x1;
                obtainedValues.rightPadY = data.y1;
				obtainedValues.leftPadX = data.x2;
                obtainedValues.leftPadY = data.y2;
            }
      });
      return GameRoom;
    }
>>>>>>> a4492f82f837223085ad6f4857909d627ace0259
}
export {obtainedValues};
export default GameRoomInit;