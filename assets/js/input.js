class Input {
  constructor(id, content, username, avatar) {
    this.id = id;
    this.content = content;
    this.username = username;
    this.avatar = avatar;
  }

  inputMainArticles(contentData) {
    return [
      ...contentData,
      {
        id: this.id,
        content: this.content,
        createdAt: new Date().toUTCString(),
        score: 0,
        user: {
          image: {
            png: this.avatar,
            webp: '',
          },
          username: this.username,
        },
        replies: [],
      },
    ];
  }

  inputReplyArticle(contentData, replyTo) {
    // wir suchen nac h der ID in den Daten
    let returnNewData = contentData.map((val) => {
      if (val.id == this.id) {
        let replyKey = val.replies.length + 1;
        val.replies.push({
          id: replyKey,
          content: this.content,
          createdAt: new Date().toUTCString(),
          score: 0,
          replyingTo: replyTo,
          user: {
            image: {
              png: this.avatar,
              webp: '',
            },
            username: this.username,
          },
        });
      }

      return val;
    });

    return returnNewData;
  }
}
