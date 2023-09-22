class Output {
  constructor(data, wrapper) {
    this.data = data;
    this.wrapper = wrapper;
  }

  buildOutBoxes() {
    this.wrapper.insertAdjacentHTML(
      'beforeend',
      `
    <section class="chatbox" id="" data-key="${this.data.id}">
        <article class="main_article_box">
          <div class="evaluation_article">
            <img src="./images/icon-plus.svg" alt="plus">
            <p>${this.data.score}</p>
            <img src="./images/icon-minus.svg" alt="plus">
          </div>
          <div class="article_body">
            <div class="article_header">
              <img src="${this.data.user.image.png}" alt="avatar">
              <p>${this.data.user.username}</p>
              <p>${this.data.createdAt}</p>
              <img src="./images/icon-reply.svg" alt="reply_icon" class="reply_icon"><span class="reply">Reply</span>
            </div>
            <div class="article_text">
              <p>${this.data.content}</p>
            </div>
          </div>
        </article>
      </section>
      <div class="reply_content">
        ${this.data.replies.length > 0 ? this.#buildReplyBoxes(this.data.replies) : ''}
      </div>
    `
    );
  }

  // Private
  #buildReplyBoxes(replies) {
    return replies
      .map((r) => {
        return `        
            <section class="reply_chatbox_section" data-reply-key="${r.id}">
              <div class="reply_border">&nbsp;</div>
              <section class="reply_chatbox">
                <article class="main_article_box">
                  <div class="evaluation_article">
                    <img src="./images/icon-plus.svg" alt="plus">
                    <p>${r.score}</p>
                    <img src="./images/icon-minus.svg" alt="plus">
                  </div>
                  <div class="article_body">
                    <div class="article_header">
                      <img src="${r.user.image.png}" alt="avatar">
                      <p>${r.user.username}</p>
                      <p>${r.createdAt}</p>
                      <img src="./images/icon-reply.svg" alt="reply_icon" class="reply_icon"><span class="reply">Reply</span>
                    </div>
                    <div class="article_text">
                      <p>${r.content}</p>
                    </div>
                  </div>
                </article>
              </section>
            </section>
        `;
      })
      .join('');
  }

  buildMainChatBox(userdata) {
    this.wrapper.insertAdjacentHTML(
      'beforeend',
      `
      <section class="input_box">      
      <input type="hidden" value="${userdata.username}">
        <img src="${userdata.image.png}" alt="avatar">
        <textarea name="input_content" id="input_content" cols="50" rows="5" placeholder="Add a comment..."></textarea>
        <button>Send</button>
      </section>
      `
    );
  }
}
