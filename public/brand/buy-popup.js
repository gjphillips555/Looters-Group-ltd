/**
 * Stay on Lootzy Storefront until Buy Now.
 * Opens Trade Me checkout in a centered popup (not a full tab).
 * Trade Me blocks embedding their payment UI in an iframe on other domains.
 */
(function () {
  function openTradeMeBuy(url) {
    if (!url) return false;
    var w = 520;
    var h = 720;
    var left = Math.max(0, (window.screen.width - w) / 2);
    var top = Math.max(0, (window.screen.height - h) / 2);
    var features = [
      "popup=yes",
      "width=" + w,
      "height=" + h,
      "left=" + left,
      "top=" + top,
      "scrollbars=yes",
      "resizable=yes",
    ].join(",");
    var win = window.open(url, "LootzyTradeMeBuy", features);
    if (!win || win.closed || typeof win.closed === "undefined") {
      // Popup blocked → same-tab fallback
      window.location.href = url;
      return false;
    }
    showCheckoutOverlay();
    var timer = setInterval(function () {
      if (win.closed) {
        clearInterval(timer);
        hideCheckoutOverlay();
      }
    }, 600);
    try { win.focus(); } catch (e) {}
    return false;
  }

  function showCheckoutOverlay() {
    var el = document.getElementById("tm-checkout-overlay");
    if (el) el.hidden = false;
  }
  function hideCheckoutOverlay() {
    var el = document.getElementById("tm-checkout-overlay");
    if (el) el.hidden = true;
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-tm-buy]");
    if (!a) return;
    e.preventDefault();
    openTradeMeBuy(a.getAttribute("href"));
  });

  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "tm-overlay-dismiss") {
      hideCheckoutOverlay();
    }
  });

  window.LootzyBuy = { open: openTradeMeBuy };
})();
