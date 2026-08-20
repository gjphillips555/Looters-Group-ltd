(function () {
  var nav = document.getElementById("top-nav");
  var mobileNav = document.getElementById("mobile-nav");
  var toggle = document.getElementById("nav-toggle");
  var shopTrigger = document.getElementById("shop-trigger");
  var shopItem = shopTrigger && shopTrigger.closest(".dropdown");

  function isMobile() {
    return window.matchMedia("(max-width: 720px)").matches;
  }

  function closeShop() {
    if (!shopItem) return;
    shopItem.classList.remove("open");
    if (shopTrigger) shopTrigger.setAttribute("aria-expanded", "false");
  }

  function setMobileOpen(open) {
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (isMobile()) {
      if (mobileNav) {
        if (open) mobileNav.removeAttribute("hidden");
        else mobileNav.setAttribute("hidden", "");
      }
      if (nav) nav.classList.toggle("open", false);
    } else {
      if (nav) nav.classList.toggle("open", open);
      if (mobileNav) mobileNav.setAttribute("hidden", "");
    }
  }

  if (toggle) {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = toggle.getAttribute("aria-expanded") === "true";
      setMobileOpen(!open);
      if (open) closeShop();
    });
  }

  if (shopTrigger && shopItem) {
    shopTrigger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = !shopItem.classList.contains("open");
      document.querySelectorAll(".nav-item.dropdown.open").forEach(function (el) {
        if (el !== shopItem) el.classList.remove("open");
      });
      shopItem.classList.toggle("open", open);
      shopTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.addEventListener("click", function (e) {
    if (shopItem && !shopItem.contains(e.target)) closeShop();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeShop();
      setMobileOpen(false);
    }
  });
})();
