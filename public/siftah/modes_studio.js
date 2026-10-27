/* Siftah modes studio v2.2 — Create / Edit / Gallery */
(function () {
  "use strict";
  var lastCreateBlob = null, lastEditBlob = null, editSourceBlob = null, lastVidBlob = null;

  function toast(m) { if (window.siftahModes) window.siftahModes.toast(m); else if (typeof showToast === "function") showToast(m); }
  function token() {
    try {
      var flux = (localStorage.getItem("siftah_flux_token") || "").trim();
      if (flux) return flux;
      var s = typeof loadSettings === "function" ? loadSettings() : {};
      return (s.token || localStorage.getItem("siftah_token") || "").trim();
    } catch (e) { return ""; }
  }
  function blobToDataUrl(blob) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader(); r.onload = function () { resolve(r.result); }; r.onerror = reject; r.readAsDataURL(blob);
    });
  }
  function normalizeOut(out) {
    return Promise.resolve().then(async function () {
      if (out instanceof Blob) return out;
      if (out && out.arrayBuffer) return new Blob([await out.arrayBuffer()], { type: "image/png" });
      if (out instanceof ArrayBuffer) return new Blob([out], { type: "image/png" });
      if (typeof out === "string" && out.indexOf("data:") === 0) return (await fetch(out)).blob();
      if (out && out.image) return normalizeOut(out.image);
      throw new Error("Unexpected image output");
    });
  }
  function normalizeVideo(out) {
    return Promise.resolve().then(async function () {
      if (out instanceof Blob) return out;
      if (out && out.arrayBuffer) return new Blob([await out.arrayBuffer()], { type: "video/mp4" });
      if (out instanceof ArrayBuffer) return new Blob([out], { type: "video/mp4" });
      if (typeof out === "string") return (await fetch(out)).blob();
      if (out && out.url) return (await fetch(out.url)).blob();
      if (out && out.video && out.video.url) return (await fetch(out.video.url)).blob();
      throw new Error("Unexpected video output");
    });
  }
  function esc(s) {
    return String(s || "").replace(/[&<>"]/g, function (c) {
      if (c === "&") return "\u0026amp;";
      if (c === "<") return "\u0026lt;";
      if (c === ">") return "\u0026gt;";
      return "\u0026quot;";
    });
  }
  function groupOf(kind) {
    if (kind === "video") return "video";
    if (kind === "file") return "file";
    return "image";
  }
  function downloadVault(item) {
    if (!window.siftahVault) return;
    window.siftahVault.get(item.id).then(function (blob) {
      if (!blob) { toast("Already deleted"); return; }
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = window.siftahVault.extOf(item.name || ("siftah-" + item.id), item.mime || blob.type);
      document.body.appendChild(a);
      a.click();
      a.remove();
    }).catch(function () { toast("Download failed"); });
  }
  function openVault(item) {
    var lb = document.getElementById("siftahLightbox");
    var box = document.getElementById("lbMedia");
    if (!lb || !box) return;
    function show(url) {
      if (item.kind === "video") box.innerHTML = '<video src="' + url + '" controls autoplay playsinline></video>';
      else if (groupOf(item.kind) === "file") box.innerHTML = '<div class="placeholder">' + esc(item.name) + "</div>";
      else box.innerHTML = '<img id="lbImg" src="' + url + '" alt="">';
      lb.classList.add("on");
    }
    if (!window.siftahVault) { if (item.dataUrl) show(item.dataUrl); return; }
    window.siftahVault.get(item.id).then(function (blob) {
      show(blob ? URL.createObjectURL(blob) : (item.thumb || item.dataUrl || ""));
    }).catch(function () { if (item.thumb) show(item.thumb); });
  }
  function showPreview(el, blob) {
    blobToDataUrl(blob).then(function (url) { el.innerHTML = '<img src="' + url + '" alt="result">'; });
  }
  function loadHFClient(t) {
    return new Promise(function (resolve, reject) {
      function make() {
        var C = window.InferenceClient || (window.HuggingFaceInference && window.HuggingFaceInference.InferenceClient);
        if (!C) return reject(new Error("InferenceClient missing"));
        resolve(new C(t));
      }
      if (window.InferenceClient || (window.HuggingFaceInference && window.HuggingFaceInference.InferenceClient)) return make();
      var sc = document.createElement("script");
      sc.src = "https://cdn.jsdelivr.net/npm/@huggingface/inference@3.0.0/dist/index.min.js";
      sc.onload = make;
      sc.onerror = function () { reject(new Error("Failed to load HF client")); };
      document.head.appendChild(sc);
    });
  }

  function ensureStudio() {
    if (document.getElementById("imageStudio")) return;
    var chatCol = document.querySelector(".chat-col");
    if (!chatCol) return;
    var studio = document.createElement("div");
    studio.id = "imageStudio";
    studio.innerHTML =
      '<div class="studio-tabs">' +
      '<button type="button" data-pane="create" class="on">Create</button>' +
      '<button type="button" data-pane="video">Video</button>' +
      '<button type="button" data-pane="edit">Edit</button>' +
      '<button type="button" data-pane="gallery">Files</button></div>' +
      '<div class="studio-pane on" id="paneCreate">' +
      "<label>Prompt</label><textarea id=\"studioCreatePrompt\" placeholder=\"Describe the image: subject, style, lighting, mood\u2026\"></textarea>" +
      "<label>Model</label><select id=\"studioCreateModel\">" +
      '<option value="black-forest-labs/FLUX.1-dev">FLUX.1 Dev \u2605 best quality</option>' +
      '<option value="black-forest-labs/FLUX.1-schnell">FLUX.1 Schnell (fast)</option>' +
      '<option value="stabilityai/stable-diffusion-xl-base-1.0">SDXL 1.0</option>' +
      '<option value="Qwen/Qwen-Image">Qwen Image</option></select>' +
      "<label>Hugging Face token for FLUX</label>" +
      '<input id="studioFluxToken" type="password" placeholder="hf_... leave blank to use the chat token" autocomplete="off" style="width:100%;box-sizing:border-box;background:#12151c;border:1px solid var(--border,#2a2e38);color:#eee;border-radius:8px;padding:10px;font-size:13px">' +
      '<p class="studio-status">FLUX needs its own Hugging Face token with Inference Providers turned on, or it fails. A second token keeps image credits off the chat token. Blank uses the chat token.</p>' +
      '<div class="studio-actions"><button type="button" class="primary" id="studioCreateBtn">Generate</button></div>' +
      '<div class="studio-status" id="studioCreateStatus"></div>' +
      '<div class="studio-preview" id="studioCreatePreview"><div class="placeholder">Your image will appear here</div></div>' +
      '<div class="studio-actions" id="studioCreateActions" style="display:none">' +
      '<button type="button" id="studioCreateDl">Download</button>' +
      '<button type="button" id="studioCreateEdit">Use in Edit</button></div></div>' +
      '<div class="studio-pane" id="paneEdit">' +
      "<label>Edit instruction</label><textarea id=\"studioEditPrompt\" placeholder=\"How should the image change?\"></textarea>" +
      "<label>Source image</label><div class=\"upload-row\">" +
      '<input type="file" id="studioEditFile" accept="image/*" style="display:none">' +
      '<button type="button" id="studioEditPick">Upload image</button>' +
      '<button type="button" id="studioEditClear">Clear</button>' +
      '<img class="upload-thumb" id="studioEditThumb" alt=""></div>' +
      "<label>Model</label><select id=\"studioEditModel\">" +
      '<option value="stabilityai/stable-diffusion-xl-base-1.0">SDXL 1.0 (I2I)</option>' +
      '<option value="black-forest-labs/FLUX.1-dev">FLUX.1 Dev</option></select>' +
      '<div class="studio-actions"><button type="button" class="primary" id="studioEditBtn">Apply edit</button></div>' +
      '<div class="studio-status" id="studioEditStatus"></div>' +
      '<div class="studio-preview" id="studioEditPreview"><div class="placeholder">Edited image will appear here</div></div>' +
      '<div class="studio-actions" id="studioEditActions" style="display:none">' +
      '<button type="button" id="studioEditDl">Download</button>' +
      '<button type="button" id="studioEditReedit">Edit again</button></div></div>' +
      '<div class="studio-pane" id="paneVideo">' +
      "<label>Prompt</label><textarea id=\"studioVidPrompt\" placeholder=\"What should the video show? Subject, motion, camera, mood\u2026\"></textarea>" +
      "<label>Model</label><select id=\"studioVidModel\">" +
      '<option value="Wan-AI/Wan2.1-T2V-1.3B">Wan 2.1 1.3B (faster)</option>' +
      '<option value="Wan-AI/Wan2.1-T2V-14B">Wan 2.1 14B</option>' +
      '<option value="tencent/HunyuanVideo">HunyuanVideo</option></select>' +
      '<p class="studio-status">Video uses the FLUX token if you set one, otherwise the chat token. It is saved in Files for 24 hours on this device.</p>' +
      '<div class="studio-actions"><button type="button" class="primary" id="studioVidBtn">Generate video</button></div>' +
      '<div class="studio-status" id="studioVidStatus"></div>' +
      '<div class="studio-preview" id="studioVidPreview"><div class="placeholder">Your video will appear here</div></div>' +
      '<div class="studio-actions" id="studioVidActions" style="display:none">' +
      '<button type="button" id="studioVidDl">Download</button></div></div>' +
      '<div class="studio-pane" id="paneGallery">' +
      '<p class="vault-legend" id="vaultLegend">Saved on this device only, free, for 24 hours. Nothing is uploaded. <span class="dot g"></span>green = just made. <span class="dot o"></span>orange after 12 hours. <span class="dot r"></span>red wash = under 2 hours left, then it is deleted. Download anything you want to keep.</p>' +
      '<div class="gallery-toolbar">' +
      '<input type="search" id="gallerySearch" placeholder="Search files\u2026">' +
      '<div class="gallery-filters" id="vaultFilters">' +
      '<button type="button" data-f="all" class="on">All</button>' +
      '<button type="button" data-f="image">Images</button>' +
      '<button type="button" data-f="video">Videos</button>' +
      '<button type="button" data-f="file">Files</button>' +
      '<button type="button" data-f="soon">Deleting soon</button></div></div>' +
      '<div class="studio-actions" style="margin-top:0">' +
      '<button type="button" id="vaultUploadBtn">Add files</button>' +
      '<input type="file" id="vaultUpload" multiple style="display:none">' +
      '<button type="button" id="vaultDownloadAll">Download all</button>' +
      '<button type="button" id="galleryRefresh">Refresh</button>' +
      '<button type="button" id="galleryClear">Clear</button></div>' +
      '<div class="gallery-grid" id="galleryGrid"></div></div>';
    chatCol.appendChild(studio);

    if (!document.getElementById("siftahLightbox")) {
      var lb = document.createElement("div");
      lb.id = "siftahLightbox"; lb.className = "lightbox";
      lb.innerHTML = '<button type="button" class="lb-close" id="lbClose">\u2715</button><div id="lbMedia"></div>';
      document.body.appendChild(lb);
      lb.onclick = function (e) { if (e.target === lb || e.target.id === "lbClose") lb.classList.remove("on"); };
    }

    studio.querySelectorAll(".studio-tabs button").forEach(function (btn) {
      btn.onclick = function () {
        studio.querySelectorAll(".studio-tabs button").forEach(function (b) { b.classList.remove("on"); });
        studio.querySelectorAll(".studio-pane").forEach(function (p) { p.classList.remove("on"); });
        btn.classList.add("on");
        var pane = btn.getAttribute("data-pane");
        var id = pane === "create" ? "paneCreate" : pane === "edit" ? "paneEdit" : pane === "video" ? "paneVideo" : "paneGallery";
        document.getElementById(id).classList.add("on");
        if (btn.getAttribute("data-pane") === "gallery") renderGallery();
      };
    });
    wireLogic();
  }

  function wireLogic() {
    if (document.getElementById("studioCreateBtn").__wired) return;
    document.getElementById("studioCreateBtn").__wired = true;
    var fluxIn = document.getElementById("studioFluxToken");
    if (fluxIn) {
      try { fluxIn.value = localStorage.getItem("siftah_flux_token") || ""; } catch (e) {}
      function saveStudioFlux() {
        try { localStorage.setItem("siftah_flux_token", fluxIn.value.trim()); } catch (e) {}
        var settingsFlux = document.getElementById("fluxToken");
        if (settingsFlux && settingsFlux.value !== fluxIn.value) settingsFlux.value = fluxIn.value;
      }
      fluxIn.addEventListener("change", saveStudioFlux);
      fluxIn.addEventListener("blur", saveStudioFlux);
    }

    document.getElementById("studioCreateBtn").onclick = async function () {
      var t = token();
      if (!t) {
        toast("Add a FLUX token in the box above, or a chat token under Advanced");
        if (typeof openSettings === "function") {
          openSettings();
          var sheet = document.querySelector(".sheet-body");
          if (sheet) sheet.classList.add("show-advanced");
          var adv = document.getElementById("toggleAdvanced");
          if (adv) adv.textContent = "Hide advanced";
        }
        return;
      }
      var prompt = (document.getElementById("studioCreatePrompt").value || "").trim();
      if (!prompt) { toast("Enter a prompt"); return; }
      var model = document.getElementById("studioCreateModel").value;
      var btn = document.getElementById("studioCreateBtn");
      var status = document.getElementById("studioCreateStatus");
      var preview = document.getElementById("studioCreatePreview");
      btn.disabled = true; status.textContent = "Generating\u2026 (10\u201360s)";
      preview.innerHTML = '<div class="placeholder">Working\u2026</div>';
      document.getElementById("studioCreateActions").style.display = "none";
      try {
        var client = await loadHFClient(t);
        var out = await client.textToImage({ model: model, inputs: prompt });
        lastCreateBlob = await normalizeOut(out);
        showPreview(preview, lastCreateBlob);
        document.getElementById("studioCreateActions").style.display = "flex";
        status.textContent = "Done";
        var url = await blobToDataUrl(lastCreateBlob);
        if (window.siftahModes) window.siftahModes.addToGallery(url, prompt, "t2i");
      } catch (e) {
        status.textContent = e.message || String(e);
        preview.innerHTML = '<div class="placeholder">Failed</div>';
        toast(status.textContent);
      } finally { btn.disabled = false; }
    };

    document.getElementById("studioCreateDl").onclick = function () {
      if (!lastCreateBlob) return;
      var a = document.createElement("a"); a.href = URL.createObjectURL(lastCreateBlob);
      a.download = "siftah-" + Date.now() + ".png"; a.click();
    };
    document.getElementById("studioCreateEdit").onclick = function () {
      if (!lastCreateBlob) return;
      editSourceBlob = lastCreateBlob;
      var thumb = document.getElementById("studioEditThumb");
      blobToDataUrl(lastCreateBlob).then(function (u) { thumb.src = u; thumb.style.display = "block"; });
      document.querySelectorAll(".studio-tabs button").forEach(function (b) {
        b.classList.toggle("on", b.getAttribute("data-pane") === "edit");
      });
      document.querySelectorAll(".studio-pane").forEach(function (p) { p.classList.remove("on"); });
      document.getElementById("paneEdit").classList.add("on");
      toast("Loaded into Edit");
    };

    document.getElementById("studioEditPick").onclick = function () { document.getElementById("studioEditFile").click(); };
    document.getElementById("studioEditFile").onchange = function (e) {
      var f = e.target.files && e.target.files[0]; if (!f) return;
      editSourceBlob = f;
      var thumb = document.getElementById("studioEditThumb");
      blobToDataUrl(f).then(function (u) { thumb.src = u; thumb.style.display = "block"; });
    };
    document.getElementById("studioEditClear").onclick = function () {
      editSourceBlob = null; document.getElementById("studioEditFile").value = "";
      var thumb = document.getElementById("studioEditThumb"); thumb.removeAttribute("src"); thumb.style.display = "none";
    };

    document.getElementById("studioEditBtn").onclick = async function () {
      var t = token();
      if (!t) { toast("Add HF token in Settings"); if (typeof openSettings === "function") openSettings(); return; }
      if (!editSourceBlob) { toast("Upload or load a source image"); return; }
      var prompt = (document.getElementById("studioEditPrompt").value || "").trim() || "enhance details, high quality";
      var model = document.getElementById("studioEditModel").value;
      var btn = document.getElementById("studioEditBtn");
      var status = document.getElementById("studioEditStatus");
      var preview = document.getElementById("studioEditPreview");
      btn.disabled = true; status.textContent = "Editing\u2026 (20\u201390s)";
      preview.innerHTML = '<div class="placeholder">Working\u2026</div>';
      document.getElementById("studioEditActions").style.display = "none";
      try {
        var client = await loadHFClient(t);
        var out = await client.imageToImage({ model: model, inputs: editSourceBlob, parameters: { prompt: prompt } });
        lastEditBlob = await normalizeOut(out);
        showPreview(preview, lastEditBlob);
        document.getElementById("studioEditActions").style.display = "flex";
        status.textContent = "Done";
        var url = await blobToDataUrl(lastEditBlob);
        if (window.siftahModes) window.siftahModes.addToGallery(url, prompt, "i2i");
      } catch (e) {
        status.textContent = e.message || String(e);
        preview.innerHTML = '<div class="placeholder">Failed \u2014 try SDXL</div>';
        toast(status.textContent);
      } finally { btn.disabled = false; }
    };

    document.getElementById("studioEditDl").onclick = function () {
      if (!lastEditBlob) return;
      var a = document.createElement("a"); a.href = URL.createObjectURL(lastEditBlob);
      a.download = "siftah-edit-" + Date.now() + ".png"; a.click();
    };
    document.getElementById("studioEditReedit").onclick = function () {
      if (!lastEditBlob) return;
      editSourceBlob = lastEditBlob;
      var thumb = document.getElementById("studioEditThumb");
      blobToDataUrl(lastEditBlob).then(function (u) { thumb.src = u; thumb.style.display = "block"; });
      toast("Output set as new source");
    };

    document.getElementById("studioVidBtn").onclick = async function () {
      var t = token();
      if (!t) { toast("Add a token under Create, or a chat token under Advanced"); return; }
      var prompt = (document.getElementById("studioVidPrompt").value || "").trim();
      if (!prompt) { toast("Enter a prompt"); return; }
      var model = document.getElementById("studioVidModel").value;
      var btn = document.getElementById("studioVidBtn");
      var status = document.getElementById("studioVidStatus");
      var preview = document.getElementById("studioVidPreview");
      btn.disabled = true;
      status.textContent = "Generating video\u2026 this can take a few minutes";
      preview.innerHTML = '<div class="placeholder">Working\u2026 stay on this screen</div>';
      document.getElementById("studioVidActions").style.display = "none";
      try {
        var client = await loadHFClient(t);
        var out = await client.textToVideo({ model: model, inputs: prompt, provider: "auto" });
        lastVidBlob = await normalizeVideo(out);
        var url = URL.createObjectURL(lastVidBlob);
        preview.innerHTML = '<video src="' + url + '" controls autoplay loop playsinline></video>';
        document.getElementById("studioVidActions").style.display = "flex";
        status.textContent = "Done \u2014 saved in Files for 24 hours";
        if (window.siftahVault) {
          window.siftahVault.add(lastVidBlob, { kind: "video", prompt: prompt, name: "siftah-" + Date.now() + ".mp4", mime: lastVidBlob.type || "video/mp4" });
        }
      } catch (e) {
        status.textContent = e.message || String(e);
        preview.innerHTML = '<div class="placeholder">Failed</div>';
        toast(status.textContent);
      } finally { btn.disabled = false; }
    };
    document.getElementById("studioVidDl").onclick = function () {
      if (!lastVidBlob) return;
      var a = document.createElement("a");
      a.href = URL.createObjectURL(lastVidBlob);
      a.download = "siftah-" + Date.now() + ".mp4";
      a.click();
    };

    var up = document.getElementById("vaultUpload");
    document.getElementById("vaultUploadBtn").onclick = function () { up.click(); };
    up.onchange = function (e) {
      var files = e.target.files ? Array.prototype.slice.call(e.target.files) : [];
      files.forEach(function (f) {
        var kind = (f.type || "").indexOf("video/") === 0 ? "video" : (f.type || "").indexOf("image/") === 0 ? "image" : "file";
        if (window.siftahVault) window.siftahVault.add(f, { kind: kind, prompt: f.name, name: f.name, mime: f.type });
      });
      up.value = "";
      toast(files.length ? "Saved on this device" : "No file");
    };
    document.getElementById("vaultDownloadAll").onclick = function () {
      var items = window.siftahVault ? window.siftahVault.list() : [];
      if (!items.length) { toast("Nothing saved"); return; }
      items.forEach(function (item, i) {
        setTimeout(function () { downloadVault(item); }, i * 400);
      });
    };
    var search = document.getElementById("gallerySearch");
    if (search) search.oninput = function () { renderGallery(); };
    var filters = document.getElementById("vaultFilters");
    if (filters) filters.querySelectorAll("button").forEach(function (b) {
      b.onclick = function () {
        filters.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
        window.__galFilter = b.getAttribute("data-f");
        renderGallery();
      };
    });
    if (window.siftahVault && !window.__vaultGalHook) {
      window.__vaultGalHook = true;
      window.siftahVault.onChange(function () { renderGallery(); });
    }

    document.getElementById("galleryRefresh").onclick = function () {
      if (window.siftahVault) window.siftahVault.refresh();
      renderGallery();
    };
    document.getElementById("galleryClear").onclick = function () {
      if (!confirm("Delete everything saved on this device?")) return;
      if (window.siftahModes) window.siftahModes.saveGallery([]);
      if (window.siftahVault) window.siftahVault.clear();
      else renderGallery();
    };
  }

  function renderGallery() {
    var grid = document.getElementById("galleryGrid");
    if (!grid) return;
    var usingVault = !!window.siftahVault;
    var items = usingVault ? window.siftahVault.list() : (window.siftahModes ? window.siftahModes.loadGallery() : []);
    var f = window.__galFilter || "all";
    var q = "";
    var search = document.getElementById("gallerySearch");
    if (search) q = (search.value || "").toLowerCase();
    else q = window.__galQuery || "";
    items = items.filter(function (item) {
      var g = groupOf(item.kind);
      if (f === "image" && g !== "image") return false;
      if (f === "video" && g !== "video") return false;
      if (f === "file" && g !== "file") return false;
      if (f === "t2i" && item.kind !== "t2i") return false;
      if (f === "i2i" && item.kind !== "i2i") return false;
      if (f === "fav" && !item.fav) return false;
      if (f === "soon" && usingVault && window.siftahVault.tone(item) !== "red") return false;
      if (q) {
        var hay = ((item.prompt || "") + " " + (item.name || "") + " " + (item.kind || "")).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
    var count = document.getElementById("studioGalleryCount");
    if (count) {
      var n = usingVault ? window.siftahVault.list().length : items.length;
      count.textContent = n + " saved";
    }
    if (!items.length) {
      grid.innerHTML = '<div class="gallery-empty">Nothing saved yet. Create an image or video, or add a file. It stays on this device for 24 hours.</div>';
      return;
    }
    grid.innerHTML = "";
    var now = Date.now();
    items.forEach(function (item) {
      var age = usingVault ? window.siftahVault.tone(item, now) : "green";
      var label = usingVault ? window.siftahVault.badge(item, now) : "Just made";
      var g = groupOf(item.kind);
      var card = document.createElement("div");
      card.className = "gallery-card age-" + age;
      var thumb = item.thumb || item.dataUrl || "";
      var visual;
      if (thumb.indexOf("data:image") === 0) {
        visual = '<div class="thumb-wrap"><img src="' + thumb + '" alt=""><div class="wash"></div><div class="age-badge">' + esc(label) + "</div></div>";
      } else {
        var mark = g === "video" ? "VIDEO" : (g === "file" ? "FILE" : "IMG");
        visual = '<div class="thumb-wrap"><div class="file-tile">' + mark + "<span>" + esc(item.name || item.kind || "") + '</span></div><div class="wash"></div><div class="age-badge">' + esc(label) + "</div></div>";
      }
      var actions = '<button type="button" data-act="view">View</button><button type="button" data-act="dl">Download</button>';
      if (g === "image") actions += '<button type="button" data-act="edit">Edit</button>';
      actions += '<button type="button" data-act="del">Del</button>';
      card.innerHTML = visual + '<div class="meta">' + esc(item.prompt || item.name || item.kind || "file") + "</div>" + '<div class="g-actions">' + actions + "</div>";
      card.querySelector('[data-act="view"]').onclick = function (e) {
        e.stopPropagation();
        if (usingVault) openVault(item);
        else if (item.dataUrl) {
          var box = document.getElementById("lbMedia");
          if (box) box.innerHTML = '<img id="lbImg" src="' + item.dataUrl + '" alt="">';
          document.getElementById("siftahLightbox").classList.add("on");
        }
      };
      var editBtn = card.querySelector('[data-act="edit"]');
      if (editBtn) editBtn.onclick = function (e) {
        e.stopPropagation();
        var src = usingVault ? window.siftahVault.get(item.id) : fetch(item.dataUrl).then(function (r) { return r.blob(); });
        Promise.resolve(src).then(function (b) {
          if (!b) return;
          editSourceBlob = b;
          var thumbEl = document.getElementById("studioEditThumb");
          var u = URL.createObjectURL(b);
          thumbEl.src = u;
          thumbEl.style.display = "block";
          document.querySelectorAll(".studio-tabs button").forEach(function (btn) {
            btn.classList.toggle("on", btn.getAttribute("data-pane") === "edit");
          });
          document.querySelectorAll(".studio-pane").forEach(function (p) { p.classList.remove("on"); });
          document.getElementById("paneEdit").classList.add("on");
          toast("Loaded into Edit");
        });
      };
      card.querySelector('[data-act="dl"]').onclick = function (e) {
        e.stopPropagation();
        if (usingVault) downloadVault(item);
        else if (item.dataUrl) {
          var a = document.createElement("a");
          a.href = item.dataUrl;
          a.download = "siftah-" + item.id + ".png";
          a.click();
        }
      };
      card.querySelector('[data-act="del"]').onclick = function (e) {
        e.stopPropagation();
        if (usingVault) window.siftahVault.remove(item.id);
        else {
          var next = (window.siftahModes ? window.siftahModes.loadGallery() : []).filter(function (x) { return x.id !== item.id; });
          if (window.siftahModes) window.siftahModes.saveGallery(next);
          renderGallery();
        }
      };
      grid.appendChild(card);
    });
  }

  window.siftahModesStudio = { ensureStudio: ensureStudio, renderGallery: renderGallery };
  setTimeout(function () {
    if (document.body.classList.contains("mode-images")) {
      ensureStudio();
      renderGallery();
    }
  }, 300);
})();
