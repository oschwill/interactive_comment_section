class Output {
  constructor(data, wrapper, userSession) {
    this.data = data;
    this.wrapper = wrapper;
    this.helperClass = new Helper();
    this.userSession = userSession;
  }

  buildOutBoxes() {
    this.wrapper.insertAdjacentHTML(
      'beforeend',
      `
    <section class="chatbox" data_key="${this.data.id}" data_username="${this.data.user.username}">
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
              ${
                this.userSession !== this.data.user.username
                  ? '<img src="./images/icon-reply.svg" alt="reply_icon" class="reply_icon"><span class="reply" onclick="openReplyChatBox(this)">Reply</span>'
                  : '<img src="./images/icon-delete.svg" alt="delete_icon" class="delete_icon" ><span class="delete" content_type="main" onclick="deleteContent(this,' +
                    this.data.id +
                    ', ' +
                    null +
                    ')">Delete</span><img src="./images/icon-edit.svg" alt="edit_icon" class="edit_icon"><span class="edit" content_type="main" onclick="editContent(this,' +
                    this.data.id +
                    ', ' +
                    `'${this.data.content}'` +
                    ')">Edit</span>'
              }
            </div>
            <div class="article_text">
              <p>${this.data.content}</p>
            </div>
          </div>
        </article>
        <div class="reply_content">
          ${
            this.data.replies.length > 0
              ? this.#buildReplyBoxes(this.data.replies, this.data.id)
              : ''
          }
        </div>
      </section>
    `
    );
  }

  // Private
  #buildReplyBoxes(replies, mainDataKey) {
    return replies
      .map((r) => {
        return `        
            <section class="reply_chatbox_section" data_main_key=${mainDataKey} data_reply_key="${
          r.id
        }" data_username="${r.user.username}">
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
                      ${
                        this.userSession !== r.user.username
                          ? '<img src="./images/icon-reply.svg" alt="reply_icon" class="reply_icon"><span class="reply" onclick="openReplyChatBox(this)">Reply</span>'
                          : '<img src="./images/icon-delete.svg" alt="delete_icon" class="delete_icon" ><span class="delete" content_type="reply" onclick="deleteContent(this,' +
                            mainDataKey +
                            ', ' +
                            r.id +
                            ')">Delete</span><img src="./images/icon-edit.svg" alt="edit_icon" class="edit_icon"><span class="edit" content_type="reply" onclick="editContent(this,' +
                            mainDataKey +
                            ', ' +
                            `'${r.content}'` +
                            ', ' +
                            r.id +
                            ')">Edit</span>'
                      }
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

  buildChatBox(userdata) {
    this.wrapper.getAttribute('class') == 'input_wrapper'
      ? this.wrapper.insertAdjacentHTML(
          'beforeend',
          `
      <section class="input_box">
        <img src="${userdata.image.png}" alt="avatar">
        <textarea name="input_content" id="input_content" cols="50" rows="5" placeholder="Add a comment..."></textarea>
        <button class="send">Send</button>
      </section>
      `
        )
      : this.wrapper.getAttribute('data_key')
      ? this.helperClass.insertAfter(
          document.createRange().createContextualFragment(
            `
            <section class="reply_input_box">     
              <img src="${userdata.image.png}" alt="avatar">
              <textarea name="reply_content" id="reply_content" cols="50" rows="5" placeholder="Add a comment..." autofocus>@${this.wrapper.getAttribute(
                'data_username'
              )}</textarea>
              <button class="create_reply">Reply</button>
            </section>
          `
          ),
          this.wrapper.querySelector('.main_article_box')
        )
      : this.helperClass.insertAfter(
          document.createRange().createContextualFragment(
            `
            <section class="reply_input_box">  
              <div class="reply_border">&nbsp;</div>   
              <img src="${userdata.image.png}" alt="avatar">
              <textarea name="reply_content" id="reply_content" cols="50" rows="5" placeholder="Add a comment..." autofocus>@${this.wrapper.getAttribute(
                'data_username'
              )}</textarea>
              <button class="create_reply">Reply</button>
            </section>
          `
          ),
          this.wrapper
        );
  }

  createNewElement() {
    let textArea = document.createElement('textarea');
    textArea.setAttribute('name', 'edit_content');
    textArea.setAttribute('id', 'edit_content');
    textArea.setAttribute('cols', '50');
    textArea.setAttribute('rows', '5');
    textArea.setAttribute('autofocus', true);
    textArea.innerText = this.data.content;

    const node = this.wrapper.querySelector('.article_text > p');

    if (node?.localName == 'p' && node !== null) {
      node.replaceWith(textArea);

      this.helperClass.insertAfter(
        document.createRange().createContextualFragment(
          `
            <button class="create_update" onclick="updateArticle(${this.data.id}, ${this.data.replId})">Update</button>
          `
        ),
        textArea
      );
    } else {
      const node = this.wrapper?.querySelector('.article_text');
      node.innerHTML = `
      <p>${this.data.content}</p>
      `;
    }
  }
}
