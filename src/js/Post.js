class Post {
  post_id = "";
  post_content = "";
  user_id = "";
  likes = "";
  date = "";
  page = 1;
  resPerPage = 3;

  api_url = "https://63828e251ada9475c8efe08c.mockapi.io";

  async createPost() {
    let session = new Session();
    let session_id = session.getSessionOfCurrentUser();

    let data = {
      post_content: this.post_content,
      user_id: session_id,
      likes: this.likes,
      date: this.date,
    };

    data = JSON.stringify(data);

    let res = await fetch(`${this.api_url}/posts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    let dataPost = await res.json();

    return dataPost;
  }

  async deletePost(post_id) {
    let res = await fetch(`${this.api_url}/posts/${post_id}`, {
      method: "DELETE",
    });

    let data = await res.json();

    return data;
  }

  async getAllPost() {
    let res = await fetch(`${this.api_url}/posts`);
    let data = await res.json();

    return data;
  }

  async deleteAllPostOfCurentUser() {
    let session = new Session();
    let session_id = session.getSessionOfCurrentUser();
    let allPost = await this.getAllPost();
    let data;
    let curUserPosts = allPost.filter((post) => post.user_id === session_id);

    for (let post of curUserPosts) {
      let res = await fetch(`${this.api_url}/posts/${post.id}`, {
        method: "DELETE",
      });

      data = await res.json();
    }
    return data;
  }

  async deleteAllPost() {
    let allPost = await this.getAllPost();

    let data;
    for (let post of allPost) {
      let res = await fetch(`${this.api_url}/posts/${post.id}`, {
        method: "DELETE",
      });

      data = await res.json();
    }
    return data;
  }

  async pagination(page) {
    let start = (page - 1) * this.resPerPage;
    let end = page * this.resPerPage;

    let data = await this.getAllPost();

    let arr = [...data];

    arr.reverse();
    arr = arr.slice(start, end);

    return arr;
  }

  async paginationMyPost(page) {
    let session = new Session();
    let session_id = session.getSessionOfCurrentUser();

    let start = (page - 1) * this.resPerPage;
    let end = page * this.resPerPage;

    let data = await this.getAllPost();

    let myPosts = data.filter((post) => post.user_id === session_id);

    myPosts.reverse();
    myPosts.slice(start, end);
    return myPosts;
  }

  async likePost(post_id) {
    let data = {
      likes: this.likes,
    };

    data = JSON.stringify(data);

    let res = await fetch(`${this.api_url}/posts/${post_id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    let likeData = await res.json();

    return likeData;
  }
}
