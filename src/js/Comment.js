class Comment {
  user_id = "";
  post_id = "";
  content = "";
  author = "";
  api_url = "https://63828e251ada9475c8efe08c.mockapi.io";

  async createComment() {
    let session = new Session();
    let session_id = session.getSessionOfCurrentUser();

    let commentData = {
      user_id: session_id,
      post_id: this.post_id,
      content: this.content,
      author: this.author,
    };

    commentData = JSON.stringify(commentData);

    let res = await fetch(`${this.api_url}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: commentData,
    });
    let data = await res.json();

    return data;
  }

  async getAllComments(post_id) {
    let res = await fetch(`${this.api_url}/comments`);
    let data = await res.json();
    let populateComents = [];

    data.forEach((com) => {
      if (com.post_id === post_id) {
        populateComents.push(com);
      }
    });

    return populateComents;
  }
}
