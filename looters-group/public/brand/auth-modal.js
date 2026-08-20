(function () {
  var modal = document.getElementById("auth-modal");
  if (!modal) return;
  function open() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function close() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }
  var openBtn = document.getElementById("open-auth-modal");
  if (openBtn) openBtn.addEventListener("click", open);
  var msgBtn = document.getElementById("open-auth-from-msg");
  if (msgBtn) msgBtn.addEventListener("click", function (e) { e.preventDefault(); open(); });
  var closeBtn = document.getElementById("auth-close");
  if (closeBtn) closeBtn.addEventListener("click", close);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) close();
  });
})();
