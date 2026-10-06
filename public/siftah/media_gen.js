/* Siftah Media Gen — image + video via HF Inference Providers */
(function () {
  "use strict";

  var IMAGE_MODELS = [
    { id: "black-forest-labs/FLUX.1-schnell", label: "FLUX.1 Schnell (fast)" },
    { id: "black-forest-labs/FLUX.1-dev", label: "FLUX.1 Dev (quality)" },
    { id: "stabilityai/stable-diffusion-xl-base-1.0", label: "SDXL 1.0" },
    { id: "stabilityai/stable-diffusion-3.5-large", label: "SD 3.5 Large" },
    { id: "Qwen/Qwen-Image", label: "Qwen Image" }
  ];

  var VIDEO_MODELS = [
    { id: "Wan-AI/Wan2.1-T2V-1.3B", label: "Wan 2.1 T2V 1.3B" },
    { id: "Lightricks/LTX-Video", label: "LTX Video" },
    { id: "tencent/HunyuanVideo", label: "HunyuanVideo" }
  ];

  function token() {
    try {
      if (typeof loadSettings === "function") {
        var s = loadSettings();
        if (s && s.token) return s.token;
      }
    } catch (e) {}
    var el = document.getElementById("token");
    return (el && el.value) || localStorage.getItem("siftah_token") || "";
  }

  function ensureUI() {
    if (document.getElementById("imgOverlay")) return;

    var nav = document.querySelector(".menu-nav");
    if (nav && !document.getElementById("menuImage")) {
      var b1 = document.createElement("button");
      b1.type = "button";
      b1.className = "menu-item";
      b1.id = "menuImage";
      b1.innerHTML = "🎨 Image Generator";
      var b2 = document.createElement("button");
      b2.type = "button";
      b2.className = "menu-item";
      b2.id = "menuVideo";
      b2.innerHTML = "🎬 Video Generator";
      var settings = document.getElementById("menuSettings");
      if (settings && settings.nextSibling) {
        nav.insertBefore(b1, settings.nextSibling);
        nav.insertBefore(b2, b1.nextSibling);
      } else {
        nav.appendChild(b1);
        nav.appendChild(b2);
      }
      b1.onclick = function () {
        if (typeof closeMenu === "function") closeMenu();
        openImg();
      };
      b2.onclick = function () {
        if (typeof closeMenu === "function") closeMenu();
        openVid();
      };
    }

    var img = document.createElement("div");
    img.id = "imgOverlay";
    img.className = "media-overlay";
    img.innerHTML =
      '<div class="media-sheet">' +
      '<div class="media-sheet-head"><h2>🎨 Image Generator</h2><button type="button" id="imgClose">✕</button></div>' +
      '<div class="media-sheet-body">' +
      "<label>Prompt</label>" +
      '<textarea id="imgPrompt" placeholder="Describe the image..."></textarea>' +
      '<p class="media-hint">Uses your HF token. Open prompts allowed — some providers may still refuse content.</p>' +
      '<div class="media-row"><div><label>Model</label><select id="imgModel"></select></div></div>' +
      '<button type="button" class="media-gen-btn" id="imgGen">Generate image</button>' +
      '<div class="media-status" id="imgStatus"></div>' +
      '<div class="media-result" id="imgResult"><div class="placeholder">Image will appear here</div></div>' +
      '<div class="media-actions" id="imgActions" style="display:none">' +
      '<button type="button" id="imgDl">⬇ Download</button>' +
      '<button type="button" id="imgToProject">+ Project</button>' +
      "</div></div></div>";
    document.body.appendChild(img);

    var vid = document.createElement("div");
    vid.id = "vidOverlay";
    vid.className = "media-overlay";
    vid.innerHTML =
      '<div class="media-sheet">' +
      '<div class="media-sheet-head"><h2>🎬 Video Generator</h2><button type="button" id="vidClose">✕</button></div>' +
      '<div class="media-sheet-body">' +
      "<label>Prompt</label>" +
      '<textarea id="vidPrompt" placeholder="Describe the video..."></textarea>' +
      '<p class="media-hint">Video via HF providers (fal / novita). Needs credits on your HF account. May take 1–3 minutes.</p>' +
      '<div class="media-row"><div><label>Model</label><select id="vidModel"></select></div></div>' +
      '<button type="button" class="media-gen-btn" id="vidGen">Generate video</button>' +
      '<div class="media-status" id="vidStatus"></div>' +
      '<div class="media-result" id="vidResult"><div class="placeholder">Video will appear here</div></div>' +
      '<div class="media-actions" id="vidActions" style="display:none">' +
      '<button type="button" id="vidDl">⬇ Download</button>' +
      "</div></div></div>";
    document.body.appendChild(vid);

    var isel = document.getElementById("imgModel");
    IMAGE_MODELS.forEach(function (m) {
      var o = document.createElement("option");
      o.value = m.id;
      o.textContent = m.label;
      isel.appendChild(o);
    });
    var vsel = document.getElementById("vidModel");
    VIDEO_MODELS.forEach(function (m) {
      var o = document.createElement("option");
      o.value = m.id;
      o.textContent = m.label;
      vsel.appendChild(o);
    });

    document.getElementById("imgClose").onclick = closeImg;
    document.getElementById("vidClose").onclick = closeVid;
    img.addEventListener("click", function (e) { if (e.target === img) closeImg(); });
    vid.addEventListener("click", function (e) { if (e.target === vid) closeVid(); });
    document.getElementById("imgGen").onclick = generateImage;
    document.getElementById("vidGen").onclick = generateVideo;
    document.getElementById("imgDl").onclick = downloadImg;
    document.getElementById("imgToProject").onclick = addImgToProject;
    document.getElementById("vidDl").onclick = downloadVid;
  }

  function openImg() {
    ensureUI();
    document.getElementById("imgOverlay").classList.add("show");
  }
  function closeImg() {
    var o = document.getElementById("imgOverlay");
    if (o) o.classList.remove("show");
  }
  function openVid() {
    ensureUI();
    document.getElementById("vidOverlay").classList.add("show");
  }
  function closeVid() {
    var o = document.getElementById("vidOverlay");
    if (o) o.classList.remove("show");
  }

  var lastImgBlob = null;
  var lastVidUrl = null;

  async function generateImage() {
    var t = token();
    if (!t) {
      if (typeof showToast === "function") showToast("Add HF token in Settings first");
      if (typeof openSettings === "function") openSettings();
      return;
    }
    var prompt = (document.getElementById("imgPrompt").value || "").trim();
    if (!prompt) {
      if (typeof showToast === "function") showToast("Enter a prompt");
      return;
    }
    var model = document.getElementById("imgModel").value;
    var btn = document.getElementById("imgGen");
    var status = document.getElementById("imgStatus");
    var result = document.getElementById("imgResult");
    btn.disabled = true;
    status.textContent = "Generating… (10–40s)";
    result.innerHTML = '<div class="placeholder">Working…</div>';
    document.getElementById("imgActions").style.display = "none";
    lastImgBlob = null;

    var urls = [
      "https://router.huggingface.co/hf-inference/models/" + model,
      "https://router.huggingface.co/fal-ai/models/" + model,
      "https://api-inference.huggingface.co/models/" + model
    ];
    var lastErr = "";
    for (var i = 0; i < urls.length; i++) {
      try {
        var res = await fetch(urls[i], {
          method: "POST",
          headers: {
            Authorization: "Bearer " + t,
            "Content-Type": "application/json",
            Accept: "image/*"
          },
          body: JSON.stringify({ inputs: prompt, parameters: { num_inference_steps: 28 } })
        });
        var ct = (res.headers.get("content-type") || "").toLowerCase();
        if (!res.ok) {
          var errText = await res.text();
          try {
            var j = JSON.parse(errText);
            lastErr = j.error || j.message || errText.slice(0, 200);
          } catch (e) {
            lastErr = errText.slice(0, 200) || ("HTTP " + res.status);
          }
          continue;
        }
        if (ct.indexOf("application/json") >= 0) {
          var data = await res.json();
          if (data.image) {
            var b64 = data.image.replace(/^data:image\/\w+;base64,/, "");
            var bin = atob(b64);
            var arr = new Uint8Array(bin.length);
            for (var k = 0; k < bin.length; k++) arr[k] = bin.charCodeAt(k);
            lastImgBlob = new Blob([arr], { type: "image/png" });
          } else if (data.url || data.output || (data.images && data.images[0])) {
            var u = data.url || data.output || data.images[0];
            if (typeof u === "string" && u.indexOf("http") === 0) {
              var ir = await fetch(u);
              lastImgBlob = await ir.blob();
            } else if (typeof u === "string") {
              var b642 = u.replace(/^data:image\/\w+;base64,/, "");
              var bin2 = atob(b642);
              var arr2 = new Uint8Array(bin2.length);
              for (var k2 = 0; k2 < bin2.length; k2++) arr2[k2] = bin2.charCodeAt(k2);
              lastImgBlob = new Blob([arr2], { type: "image/png" });
            }
          } else {
            lastErr = JSON.stringify(data).slice(0, 180);
            continue;
          }
        } else {
          lastImgBlob = await res.blob();
        }
        if (lastImgBlob && lastImgBlob.size > 100) {
          var url = URL.createObjectURL(lastImgBlob);
          result.innerHTML = '<img src="' + url + '" alt="generated">';
          document.getElementById("imgActions").style.display = "flex";
          status.textContent = "Done";
          btn.disabled = false;
          return;
        }
      } catch (err) {
        lastErr = err.message || String(err);
      }
    }
    result.innerHTML = '<div class="err">Failed: ' + (lastErr || "unknown") + "</div>";
    status.textContent = "Try another model or check HF credits / token permissions";
    btn.disabled = false;
  }

  function downloadImg() {
    if (!lastImgBlob) return;
    var a = document.createElement("a");
    a.href = URL.createObjectURL(lastImgBlob);
    a.download = "siftah-image-" + Date.now() + ".png";
    a.click();
  }

  function addImgToProject() {
    if (!lastImgBlob) return;
    var reader = new FileReader();
    reader.onload = function () {
      var dataUrl = reader.result;
      var name = "image-" + Date.now() + ".png.txt";
      if (typeof putFile === "function") {
        putFile(name, dataUrl, true);
        if (typeof showToast === "function") showToast("Added " + name + " (data URL)");
      }
    };
    reader.readAsDataURL(lastImgBlob);
  }

  async function generateVideo() {
    var t = token();
    if (!t) {
      if (typeof showToast === "function") showToast("Add HF token in Settings first");
      if (typeof openSettings === "function") openSettings();
      return;
    }
    var prompt = (document.getElementById("vidPrompt").value || "").trim();
    if (!prompt) {
      if (typeof showToast === "function") showToast("Enter a prompt");
      return;
    }
    var model = document.getElementById("vidModel").value;
    var btn = document.getElementById("vidGen");
    var status = document.getElementById("vidStatus");
    var result = document.getElementById("vidResult");
    btn.disabled = true;
    status.textContent = "Generating video… can take 1–3 min";
    result.innerHTML = '<div class="placeholder">Working…</div>';
    document.getElementById("vidActions").style.display = "none";
    lastVidUrl = null;

    var endpoints = [
      "https://router.huggingface.co/fal-ai/" + model,
      "https://router.huggingface.co/novita/" + model,
      "https://router.huggingface.co/hf-inference/models/" + model
    ];
    var lastErr = "";
    for (var i = 0; i < endpoints.length; i++) {
      try {
        var res = await fetch(endpoints[i], {
          method: "POST",
          headers: {
            Authorization: "Bearer " + t,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: prompt,
            prompt: prompt,
            parameters: { num_frames: 25 }
          })
        });
        var ct = (res.headers.get("content-type") || "").toLowerCase();
        if (!res.ok) {
          var errText = await res.text();
          try {
            var j = JSON.parse(errText);
            lastErr = j.error || j.message || errText.slice(0, 220);
          } catch (e) {
            lastErr = errText.slice(0, 220) || ("HTTP " + res.status);
          }
          continue;
        }
        if (ct.indexOf("video/") >= 0 || ct.indexOf("octet-stream") >= 0) {
          var blob = await res.blob();
          lastVidUrl = URL.createObjectURL(blob);
          result.innerHTML = '<video src="' + lastVidUrl + '" controls autoplay loop></video>';
          document.getElementById("vidActions").style.display = "flex";
          status.textContent = "Done";
          btn.disabled = false;
          return;
        }
        var data = await res.json();
        var url = data.video || data.url || data.output || (data.videos && data.videos[0]);
        if (typeof url === "string" && url.indexOf("http") === 0) {
          lastVidUrl = url;
          result.innerHTML = '<video src="' + url + '" controls autoplay loop></video>';
          document.getElementById("vidActions").style.display = "flex";
          status.textContent = "Done";
          btn.disabled = false;
          return;
        }
        lastErr = JSON.stringify(data).slice(0, 200);
      } catch (err) {
        lastErr = err.message || String(err);
      }
    }
    result.innerHTML =
      '<div class="err">Video gen failed: ' +
      (lastErr || "no provider accepted this model") +
      "<br><br>Video models often need HF Pro credits or a fal/novita-enabled token. Image gen is more reliable on free tier.</div>";
    status.textContent = "Try Image Generator, or enable provider billing on HF";
    btn.disabled = false;
  }

  function downloadVid() {
    if (!lastVidUrl) return;
    var a = document.createElement("a");
    a.href = lastVidUrl;
    a.download = "siftah-video-" + Date.now() + ".mp4";
    a.target = "_blank";
    a.click();
  }

  function boot() {
    ensureUI();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 100); });
  else setTimeout(boot, 100);
})();
