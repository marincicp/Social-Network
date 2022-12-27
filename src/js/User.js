class User {
  user_id = "";
  username = "";
  email = "";
  password = "";
  city = "";
  phone = "";
  birthDate = "";
  api_url = "https://63828e251ada9475c8efe08c.mockapi.io";

  async getAllUser() {
    let res = await fetch(`${this.api_url}/users`);
    let data = await res.json();

    return data;
  }

  async loginUser() {
    let res = await fetch(`${this.api_url}/users`);
    let data = await res.json();

    data.forEach((user) => {
      if (user.email === this.email && user.password === this.password) {
        let session = new Session();
        session.user_id = user.id;
        session.startSession();

        window.location.href = "profile.html";
      }
    });
  }

  createUser() {
    let data = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    data = JSON.stringify(data);
    fetch(`${this.api_url}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        let session = new Session();
        session.user_id = data.id;
        session.startSession();

        window.location.href = "profile.html";
      });
  }

  editUser(session_id) {
    let data = {
      username: this.username,
      email: this.email,
      birthDate: this.birthDate,
      city: this.city,
      phone: this.phone,
    };

    data = JSON.stringify(data);

    fetch(`${this.api_url}/users/${session_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.href = "profile.html";
        return data;
      });
  }

  deleteUser() {
    let session = new Session();
    session_id = session.getSessionOfCurrentUser();

    fetch(`${this.api_url}/users/${session_id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        session.destroySession();
        window.location.href = "/";
      });
  }

  async getCurrentUser(session_id) {
    let res = await fetch(`${this.api_url}/users`);
    let data = await res.json();

    let currentUser = data.find((user) => user.id === session_id);

    return currentUser;
  }

  async selectPrimatelj() {
    let res = await fetch(`${this.api_url}/users`);
    let data = await res.json();

    return data;
  }
}
