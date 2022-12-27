class Message {
  message_id = "";
  posiljatelj_id = "";
  primatelj_id = "";
  posiljatelj_username = "";
  primatelj_username = "";
  message_content = "";
  date = "";
  api_url = "https://63828e251ada9475c8efe08c.mockapi.io";

  async sendMessage() {
    let data = {
      posiljatelj_id: this.posiljatelj_id,
      posiljatelj_username: this.posiljatelj_username,
      primatelj_id: this.primatelj_id,
      primatelj_username: this.primatelj_username,
      message_content: this.message_content,
      date: this.date,
    };

    data = JSON.stringify(data);

    let res = await fetch(`${this.api_url}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    let dataMessage = await res.json();
  }

  async getMessageOfCurrentUser() {
    let session = new Session();
    let session_id = session.getSessionOfCurrentUser();

    let res = await fetch(`${this.api_url}/message`);
    let data = await res.json();

    data = data.filter((poruka) => poruka.primatelj_id === session_id);

    return data;
  }

  async deleteMessage(message_id) {
    let res = await fetch(`${this.api_url}/message/${message_id}`, {
      method: "DELETE",
    });

    let data = await res.json();
    return data;
  }
}
