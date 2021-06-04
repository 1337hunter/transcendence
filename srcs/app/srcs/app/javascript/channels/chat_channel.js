import consumer from "./consumer"
import MainSPA from "../packs/main_spa";


function disconnect_from_rooms () {
  consumer.subscriptions.subscriptions.forEach((subscription) => {
    let found = subscription.identifier.search("\"channel\":\"ChatChannel\"")
    if (found != -1)
      consumer.subscriptions.remove(subscription)
  } )
}

let SubToChannel = {
    async join(id)
    {
      await disconnect_from_rooms();
      consumer.subscriptions.create({channel: "ChatChannel", room_id: id}, {
      initialized() {
        this.id = id;
      },

      connected() {
        // Called when the subscription is ready for use on the server
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        var current_user_id = MainSPA.SPA.router.currentuser.get('id')
        var found = false;
        for (let i = 0; i < data.block.length; ++i)
        {
          if (data.block[i].user_id == current_user_id) {
            found = true;
            break ;
          }
        }
        if (data.room_id == this.id && !found)
        {
            // <div class="message" data-user-id="${data.user_id}">
            //   <table>
            //     <tr style="vertical-align:top;"><th><img class="user_icon" width="35px" height="35px" src="${data.avatar}" style="margin-bottom: 10px"></th>
            //     <th id="user-name">${data.displayname}:</th>
            //     <th id="message-content"> ${data.content} </th></tr>
            //   </table>
            // </div>
            
            $('#messages').append(`
            <div class="message" data-user-id="${data.user_id}">
              <table>
                <tr style="vertical-align:top;"><th><img class="user_icon" width="35px" height="35px" src="${data.avatar}" style="margin-bottom: 10px"></th>
                <th id="user-name">${data.displayname}:</th>
                <th id="message-content"> ${data.content} </th>`)
            if (current_user_id == data.room_owner_id && current_user_id != data.user_id)
            {
                $('#messages').append(`
                <th>
                  <div style="width: 7%; float:left;" id="block_user_room"><%= show_svg('block.svg') %></div></div>
                </th>`)
            }
            $('#messages').append(`</tr>
              </table>
            </div>`)
            $("#messages").scrollTop($("#messages")[0].scrollHeight);
        }
      }
    })
  }
}

export default SubToChannel;
