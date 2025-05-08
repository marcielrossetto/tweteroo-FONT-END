let _username = "";
const BACKEND_URL = "http://localhost:5000";

function signUp() {
  const name = document.querySelector("#username").value;
  const avatar = document.querySelector("#picture").value;
  const email = document.querySelector("#email").value;

  axios.post(`${BACKEND_URL}/sign-up`, {
    name,
    avatar,
    email
  }).then(() => {
    _username = name;
    loadTweets();
  }).catch(err => {
    console.error("Erro ao fazer cadastro:", err.response?.data || err.message);
    alert("Erro ao fazer cadastro! Consulte os logs.");
  });
}

function loadTweets() {
  axios.get(`${BACKEND_URL}/tweets`)
    .then(res => {
      const tweets = res.data;
      const container = document.querySelector(".tweets-page .tweets");
      container.innerHTML = tweets.map(tweet => Tweet(tweet)).join("");

      document.querySelector(".pagina-inicial").classList.add("hidden");
      document.querySelector(".tweets-page").classList.remove("hidden");
    })
    .catch(err => {
      console.error("Erro ao carregar tweets:", err.response?.data || err.message);
    });
}

function Tweet({ _id, avatar, username, tweet }) {
  return `
    <div class="tweet">
      <div class="avatar">
        <img src="${avatar}" />
      </div>
      <div class="content">
        <div class="user">@${username}</div>
        <div class="body">${escapeHtml(tweet)}</div>
      </div>
      ${insertButtonToEditOrDelete(_id, username)}
    </div>
  `;
}

function insertButtonToEditOrDelete(id, username) {
  if (username === _username) {
    return `
      <div class="delete" onclick="deleteThisTweet('${id}')">❌</div>
      <div class="edit" onclick="editThisTweet('${id}')">✏️</div>
    `;
  }
  return "";
}

function deleteThisTweet(id) {
  axios.delete(`${BACKEND_URL}/tweets/${id}`)
    .then(() => {
      alert("Tweet deletado com sucesso!");
      loadTweets();
    })
    .catch(err => {
      console.error("Erro ao deletar tweet:", err.response?.data || err.message);
      alert("Erro ao deletar tweet!");
    });
}

function editThisTweet(id) {
  const newTweet = prompt("Insira o novo conteúdo do tweet:");
  if (!newTweet) return;

  axios.put(`${BACKEND_URL}/tweets/${id}`, {
    username: _username,
    tweet: newTweet
  }).then(() => {
    alert("Tweet editado com sucesso!");
    loadTweets();
  }).catch(err => {
    console.error("Erro ao editar tweet:", err.response?.data || err.message);
    alert("Erro ao editar tweet!");
  });
}

function postTweet() {
  const tweet = document.querySelector("#tweet").value;

  axios.post(`${BACKEND_URL}/tweets`, {
    username: _username,
    tweet
  }).then(() => {
    document.querySelector("#tweet").value = "";
    loadTweets();
  }).catch(err => {
    console.error("Erro ao postar tweet:", err.response?.data || err.message);
    alert("Erro ao postar tweet!");
  });
}

function loadUserTweets(username) {
  axios.get(`${BACKEND_URL}/tweets/${username}`)
    .then(res => {
      const tweets = res.data;
      const container = document.querySelector(".user-tweets-page .tweets");
      container.innerHTML = tweets.map(tweet => Tweet(tweet)).join("");

      document.querySelector(".tweets-page").classList.add("hidden");
      document.querySelector(".user-tweets-page").classList.remove("hidden");
    })
    .catch(err => {
      console.error("Erro ao carregar tweets do usuário:", err.response?.data || err.message);
    });
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
