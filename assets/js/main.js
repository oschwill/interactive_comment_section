/* CONTAINER */
const wrapper = document.querySelector('.chat_wrapper');

/* DATA */
let currentUser = {};
let contentData = {};

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

/* UI FUNCTIONS */
const buildOutBoxes = (likes, avatar, userName, date, content) => {};

const contentSiteBuilder = async () => {
  // Get all Data from json Object
  let data = await getDataFromJsonObject();

  // ContentBoxen erstellen!!
  data.contentData.forEach((c) => {
    let output = new Output(c, wrapper);
    output.buildOutBoxes();
  });

  // Die Main ChatBox erstellen für den User
  let output = new Output(null, wrapper); // Für die Userdaten brauchen wir die ContentDaten nicht daher null
  output.buildMainChatBox(data.currentUser);
};

// RUN
contentSiteBuilder();
