import consumer from "./consumer"

let SubToChannel = {
    join(id)
    {
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
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        console.log(data.room_id);
        console.log(this.id)
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
        }
      }
    })
  }
}

export default SubToChannel;
