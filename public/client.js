
const socket = io();
let user = { name: "", avatar: "" };

function submitUser() {
  const name = document.getElementById("nickname").value.trim();
  const file = document.getElementById("avatarUpload").files[0];
  if (!name || !file) return alert("请填写昵称并上传头像");

  const reader = new FileReader();
  reader.onload = function(e) {
    user.name = name;
    user.avatar = e.target.result;
    document.getElementById("userModal").style.display = "none";
  };
  reader.readAsDataURL(file);
}

document.getElementById("form").addEventListener("submit", function(e) {
  e.preventDefault();
  const val = document.getElementById("input").value.trim();
  if (!val) return;
  socket.emit("chat message", {
    name: user.name,
    avatar: user.avatar,
    text: val
  });
  document.getElementById("input").value = "";
});

socket.on("chat message", function(msg) {
  const container = document.createElement("div");
  container.className = "message";
  container.innerHTML = `<img src="${msg.avatar}" style="width:32px;height:32px;border-radius:50%;vertical-align:middle;margin-right:8px;">
                         <strong style="font-size:12px;">${msg.name}</strong><div>${msg.text}</div>`;
  document.getElementById("messages").appendChild(container);
  document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
});
