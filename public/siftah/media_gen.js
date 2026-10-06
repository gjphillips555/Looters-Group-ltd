/* Siftah Media Gen v2 — HF InferenceClient (image + video) */
(function () {
  "use strict";

  var IMAGE_MODELS = [
    { id: "black-forest-labs/FLUX.1-schnell", label: "FLUX.1 Schnell (fast)", provider: "auto" },
    { id: "black-forest-labs/FLUX.1-dev", label: "FLUX.1 Dev", provider: "auto" },
    { id: "stabilityai/stable-diffusion-xl-base-1.0", label: "SDXL 1.0", provider: "auto" },
    { id: "Qwen/Qwen-Image", label: "Qwen Image", provider: "auto" }
  ];

  var VIDEO_MODELS = [
    { id: "Wan-AI/Wan2.1-T2V-1.3B", label: "Wan 2.1 T2V 1.3B (fal)", provider: "fal-ai" },
    { id: "Lightricks/LTX-Video", label: "LTX Video", provider: "fal-ai" },
    { id: "tencent/HunyuanVideo", label: "HunyuanVideo", provider: "fal-ai" },
    { id: "Wan-AI/Wan2.1-T2V-14B", label: "Wan 2.1 T2V 14B", provider: "fal-ai" }
  ];

  var hfClient = null;
  var hfClientLoading = null;

  function token() {
    try {
      if (typeof loadSettings === "function") {
        var s = loadSettings();
        if (s && s.token) return s.token;
      }
    } catch (e) {}
    var el = document.getElementById("token");
    return (el && el.value) || "";
  }

  function loadHFClient() {
    if (hfClient) return Promise.resolve(hfClient);
    if (hfClientLoading) return hfClientLoading;
    hfClientLoading = import("https://cdn.jsdelivr.net/npm/@huggingface/inference@3/+esm")
      .then(function (mod) {
        var InferenceClient = mod.InferenceClient || mod.HfInference || mod.default;
        if (!InferenceClient) throw new Error("InferenceClient not found in SDK");
        var t = token();
        if (!t) throw new Error("No HF token — open Settings and paste your token");
        hfClient = new InferenceClient(t);
        return hfClient;
      })
      .catch(function (err) {
        hfClientLoading = null;
        throw err;
      });
    return hfClientLoading;
  }

  function refreshClient() {
    hfClient = null;
    hfClientLoading = null;
    return loadHFClient();
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
      '<p class="media-hint">Uses HF Inference Providers + your token (same as chat). PRO helps with credits.</p>' +
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
      '<p class="media-hint">Video runs on fal/Replicate via HF. Needs Inference Provider credits (PRO ~$2/mo included). Can take 1–3 min. Token must have <strong>Inference Providers</strong> permission.</p>' +
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
  var lastVidBlob = null;
  var lastVidUrl = null;

  function friendlyErr(err) {
    var msg = (err && err.message) || String(err || "unknown error");
    if (/403|401|unauthorized|authentication/i.test(msg))
      return "Auth failed — token needs Inference Providers permission (fine-grained token).";
    if (/402|payment|credit|billing|quota|exceeded|rate limit/i.test(msg))
      return "Out of Inference credits. PRO includes ~$2/mo; add credits at huggingface.co/settings/billing";
    if (/not support|no provider|not been able to find|404/i.test(msg))
      return "Model not available on current providers. Try another model in the list.";
    if (/Failed to fetch|NetworkError|CORS/i.test(msg))
      return "Network error. Check connection / ad blockers.";
    return msg.slice(0, 280);
  }

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
    status.textContent = "Generating… (10–60s)";
    result.innerHTML = '<div class="placeholder">Working…</div>';
    document.getElementById("imgActions").style.display = "none";
    lastImgBlob = null;

    try {
      var client = await refreshClient();
      var out = await client.textToImage({
        model: model,
        inputs: prompt,
        provider: "auto"
      });
      if (out instanceof Blob) {
        lastImgBlob = out;
      } else if (out && out.arrayBuffer) {
        lastImgBlob = new Blob([await out.arrayBuffer()], { type: "image/png" });
      } else if (out instanceof ArrayBuffer) {
        lastImgBlob = new Blob([out], { type: "image/png" });
      } else if (typeof out === "string" && out.indexOf("http") === 0) {
        var r = await fetch(out);
        lastImgBlob = await r.blob();
      } else {
        lastImgBlob = new Blob([out], { type: "image/png" });
      }
      var url = URL.createObjectURL(lastImgBlob);
      result.innerHTML = '<img src="' + url + '" alt="generated">';
      document.getElementById("imgActions").style.display = "flex";
      status.textContent = "Done";
    } catch (err) {
      console.error(err);
      result.innerHTML = '<div class="err">' + friendlyErr(err) + "</div>";
      status.textContent = "Failed";
    }
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
      if (typeof putFile === "function") {
        putFile("image-" + Date.now() + ".png.txt", reader.result, true);
        if (typeof showToast === "function") showToast("Added image data URL to Project");
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
    var meta = VIDEO_MODELS.find(function (m) { return m.id === model; }) || { provider: "fal-ai" };
    var btn = document.getElementById("vidGen");
    var status = document.getElementById("vidStatus");
    var result = document.getElementById("vidResult");
    btn.disabled = true;
    status.textContent = "Queued on provider… often 1–3 minutes";
    result.innerHTML = '<div class="placeholder">Generating video… stay on this screen</div>';
    document.getElementById("vidActions").style.display = "none";
    lastVidBlob = null;
    lastVidUrl = null;

    var providers = [meta.provider, "fal-ai", "replicate", "novita", "auto"];
    providers = providers.filter(function (p, i, a) { return a.indexOf(p) === i; });

    var lastErr = null;
    for (var i = 0; i < providers.length; i++) {
      try {
        status.textContent = "Trying provider: " + providers[i] + "…";
        var client = await refreshClient();
        var out = await client.textToVideo({
          model: model,
          inputs: prompt,
          provider: providers[i]
        });
        if (typeof out === "string" && out.indexOf("http") === 0) {
          lastVidUrl = out;
          result.innerHTML = '<video src="' + out + '" controls autoplay loop playsinline></video>';
        } else if (out instanceof Blob) {
          lastVidBlob = out;
          lastVidUrl = URL.createObjectURL(out);
          result.innerHTML = '<video src="' + lastVidUrl + '" controls autoplay loop playsinline></video>';
        } else if (out && out.url) {
          lastVidUrl = out.url;
          result.innerHTML = '<video src="' + lastVidUrl + '" controls autoplay loop playsinline></video>';
        } else if (out && out.arrayBuffer) {
          lastVidBlob = new Blob([await out.arrayBuffer()], { type: "video/mp4" });
          lastVidUrl = URL.createObjectURL(lastVidBlob);
          result.innerHTML = '<video src="' + lastVidUrl + '" controls autoplay loop playsinline></video>';
        } else {
          throw new Error("Unexpected video response type");
        }
        document.getElementById("vidActions").style.display = "flex";
        status.textContent = "Done (" + providers[i] + ")";
        btn.disabled = false;
        return;
      } catch (err) {
        console.error("video provider", providers[i], err);
        lastErr = err;
      }
    }
    result.innerHTML =
      '<div class="err">' +
      friendlyErr(lastErr) +
      "<br><br><strong>Checklist:</strong><br>" +
      "1. Token has <em>Inference Providers</em> write permission<br>" +
      "2. Billing has credits left (PRO ≈ $2/mo included)<br>" +
      "3. At hf.co/settings/inference-providers enable fal-ai<br>" +
      "4. Try Wan 2.1 1.3B first (cheapest/fastest)" +
      "</div>";
    status.textContent = "All providers failed";
    btn.disabled = false;
  }

  function downloadVid() {
    if (lastVidBlob) {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(lastVidBlob);
      a.download = "siftah-video-" + Date.now() + ".mp4";
      a.click();
      return;
    }
    if (lastVidUrl) {
      var a2 = document.createElement("a");
      a2.href = lastVidUrl;
      a2.download = "siftah-video-" + Date.now() + ".mp4";
      a2.target = "_blank";
      a2.click();
    }
  }

  function boot() {
    ensureUI();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 100); });
  else setTimeout(boot, 100);
})();
