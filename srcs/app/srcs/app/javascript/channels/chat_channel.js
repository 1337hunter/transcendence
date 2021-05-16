import consumer from "./consumer"

function disconnect_from_rooms () {
  consumer.subscriptions.subscriptions.forEach((subscription) => {
    let found = subscription.identifier.search("\"channel\":\"ChatChannel\"")
    if (found != -1)
      consumer.subscriptions.remove(subscription)
  } )
}

let SubToChannel = {
    join(id)
    {
      disconnect_from_rooms();
      consumer.subscriptions.create({channel: "ChatChannel", room_id: id}, {
      initialized() {
        this.id = id;
        console.log("connected to " + id)
      },

      connected() {
        // Called when the subscription is ready for use on the server
        console.log("Connected to chat channel...")
      },

      disconnected() {
        console.log("Disconnected from room_" + id)
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        if (data.room_id == this.id)
        {
          $('#messages').append(`
            <div class="message" data-user-id="${data.user_id}">
              <table>
                <tr><th><img class="user_icon" width="35px" height="35px" src="${data.avatar}" style="margin-bottom: 10px"></th>
                <th id="user-name">${data.displayname}:</th>
                <th id="message-content"> ${data.content} </th></tr>
              </table>
            </div>`)
            $("#messages").scrollTop($("#messages")[0].scrollHeight);
        }
      }
    })
  }
}

export default SubToChannel;
