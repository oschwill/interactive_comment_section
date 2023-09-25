/* CONTAINER */
const wrapper = document.querySelector('.chat_wrapper');
const inputWrapper = document.querySelector('.input_wrapper');

/* DATA */
let currentUser = {};
let contentData = {};
let lastMainKey, replyKey;

/* FETCH DATA FUNCTION */
const getDataFromJsonObject = async () => {
  await fetch('./data.json')
    .then((response) => response.json())
    .then((json) => {
      currentUser = {
        ...json.currentUser,
      };
      contentData = [...json.comments];
    });

  return { currentUser, contentData };
};

// Baue Seite
const contentSiteBuilder = async () => {
  // Get all Data from json Object
  let data = await getDataFromJsonObject();

  // ContentBoxen erstellen!!
  data.contentData.forEach((c) => {
    let output = new Output(c, wrapper, currentUser.username);
    output.buildOutBoxes();
  });

  // Die Main ChatBox erstellen für den User
  let output = new Output(null, inputWrapper, currentUser.username); // Für die Userdaten brauchen wir die ContentDaten nicht daher null
  output.buildChatBox(data.currentUser);

  // return last main id key
  return data.contentData[data.contentData.length - 1].id;
};

// RUN
const run = async () => {
  // Warten bis Daten vorhanden inkl. lastkey und die Seite gebaut ist
  lastMainKey = await contentSiteBuilder();
  const sendButton = document.querySelector('.send');
  const replyButton = document.querySelectorAll('.reply');

  /* EVENT LISTENER */
  sendButton.addEventListener('click', inputMain);
};

run();

/* FUNCTIONS */
const inputMain = () => {
  let contentVal = document.querySelector('#input_content').value;
  if (contentVal == '') {
    alert('Bitte geben Sie Ihren Text an!');
    return;
  }

  // Id incrementen!
  lastMainKey++;
  // Datenbank / LocalStorage persistent machen INPUT
  // ...
  let input = new Input(lastMainKey, contentVal, currentUser.username, currentUser.image.png);
  contentData = input.inputMainArticles(contentData);

  wrapper.innerHTML = ''; // clearn alles
  // ContentBoxen erstellen!!
  contentData.forEach((c) => {
    let output = new Output(c, wrapper, currentUser.username);
    output.buildOutBoxes();
  });

  // clearn
  document.querySelector('#input_content').value = '';
};

const openReplyChatBox = (rb) => {
  // checken ob es eine reply_input_box schon gibt
  let replyBox = document.querySelector('.reply_input_box');
  if (replyBox !== null) {
    replyBox.remove();
    return;
  }

  let parentReplyElement = rb.closest('.reply_chatbox_section'); // reply auf reply
  if (parentReplyElement === null) {
    parentReplyElement = rb.closest('.chatbox'); // reply auf main
  }

  // Wir holen uns die id des Articles das wir replien wollen
  let dataMainKey = parentReplyElement.getAttribute('data_key')
    ? parentReplyElement.getAttribute('data_key')
    : parentReplyElement.getAttribute('data_main_key');

  let replyTo = parentReplyElement.getAttribute('data_username');

  let output = new Output(currentUser, parentReplyElement);
  output.buildChatBox(currentUser);

  const createReply = document.querySelector('.create_reply');

  // EventListener
  createReply.addEventListener('click', (e) => {
    let replyBox = document.querySelector('.reply_input_box');
    let replyVal = document.querySelector('#reply_content').value;

    if (replyVal == '') {
      alert('Bitte geben Sie einen Text ein!!');
      return;
    }

    let input = new Input(dataMainKey, replyVal, currentUser.username, currentUser.image.png);
    contentData = input.inputReplyArticle(contentData, replyTo);

    // output neuen content
    let replyContentWrapper = parentReplyElement.querySelector('.reply_content')
      ? parentReplyElement.querySelector('.reply_content')
      : parentReplyElement.closest('.reply_content');

    wrapper.innerHTML = ''; // clearn alles
    // ContentBoxen erstellen!!
    contentData.forEach((c) => {
      let output = new Output(c, wrapper, currentUser.username);
      output.buildOutBoxes();
    });

    // chat box entfernen
    replyBox.remove();
  });
};

deleteContent = async (button, id, replId) => {
  // Abfrage wirklich Delete?
  swal({
    title: 'Delete comment',
    text: 'Are you sure you want to delete this comment? This will remove the comment and cant be undone',
    icon: '',
    buttons: {
      cancel: 'NO CANCEL',
      YES: 'YES DELETE',
    },
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      if (button.getAttribute('content_type') == 'main') {
        contentData = contentData.filter((val) => val.id !== id);
      } else if (button.getAttribute('content_type') == 'reply') {
        contentData = contentData.map((val) => {
          if (val.id == id) {
            return {
              id: val.id,
              content: val.content,
              createdAt: val.createdAt,
              score: val.score,
              user: {
                image: {
                  png: val.user.image.png,
                  webp: val.user.image.webp,
                },
                username: val.user.username,
              },
              replies: val.replies.filter((val) => val.id !== replId),
            };
          }
          return val;
        });
      }

      wrapper.innerHTML = ''; // clearn alles
      // ContentBoxen erstellen!!
      contentData.forEach((c) => {
        let output = new Output(c, wrapper, currentUser.username);
        output.buildOutBoxes();
      });
      swal('Your content has been deleted!', {
        icon: 'success',
      });
    }
  });
};

const editContent = (button, id, content, replId = null) => {};
