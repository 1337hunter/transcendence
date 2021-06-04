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
    createGameRoom: function (args) {
        const GameRoom = consumer.subscriptions.create({channel: "GameRoomChannel", match_id: args.id}, {
            connected() {
            // Called when the subscription is ready for use on the server
                console.log("Connected to game room channel " + args.id);
                consumer.subscriptions.subscriptions.forEach((subscription) => {
                   console.log(subscription);
                  } )
            },

            disconnected() {
				console.log("Disconnected from game channel " + args.id);
              // Called when the subscription has been terminated by the server
            },

            received(data) {
                console.log(data)
            //    obtainedValues.rightPadX = data.x1;
            //    obtainedValues.rightPadY = data.y1;
			//	obtainedValues.leftPadX = data.x2;
            //    obtainedValues.leftPadY = data.y2;
            }
      });
      return GameRoom;
    }
}
export {obtainedValues};
export default GameRoomInit;