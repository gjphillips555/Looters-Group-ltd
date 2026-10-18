/* Siftah modes studio v2.2 — Create / Edit / Gallery */
(function () {
  "use strict";
  var lastCreateBlob = null, lastEditBlob = null, editSourceBlob = null;

  function toast(m) { if (window.siftahModes) window.siftahModes.toast(m); else if (typeof showToast === "function") showToast(m); }
  function token() {
    try {
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
      '<button type="button" data-pane="edit">Edit</button>' +
      '<button type="button" data-pane="gallery">Gallery</button></div>' +
      '<div class="studio-pane on" id="paneCreate">' +
      "<label>Prompt</label><textarea id=\"studioCreatePrompt\" placeholder=\"Describe the image: subject, style, lighting, mood\u2026\"></textarea>" +
      "<label>Model</label><select id=\"studioCreateModel\">" +
      '<option value="black-forest-labs/FLUX.1-dev">FLUX.1 Dev \u2605 best quality</option>' +
      '<option value="black-forest-labs/FLUX.1-schnell">FLUX.1 Schnell (fast)</option>' +
      '<option value="stabilityai/stable-diffusion-xl-base-1.0">SDXL 1.0</option>' +
      '<option value="Qwen/Qwen-Image">Qwen Image</option></select>' +
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
      '<option value="stabilityai/stable-diffusion-xl-refiner-1.0">SDXL Refiner</option>' +
      '<option value="black-forest-labs/FLUX.1-dev">FLUX.1 Dev</option></select>' +
      '<div class="studio-actions"><button type="button" class="primary" id="studioEditBtn">Apply edit</button></div>' +
      '<div class="studio-status" id="studioEditStatus"></div>' +
      '<div class="studio-preview" id="studioEditPreview"><div class="placeholder">Edited image will appear here</div></div>' +
      '<div class="studio-actions" id="studioEditActions" style="display:none">' +
      '<button type="button" id="studioEditDl">Download</button>' +
      '<button type="button" id="studioEditReedit">Edit again</button></div></div>' +
      '<div class="studio-pane" id="paneGallery">' +
      '<div class="studio-actions" style="margin-top:0">' +
      '<button type="button" id="galleryRefresh">Refresh</button>' +
      '<button type="button" id="galleryClear">Clear gallery</button></div>' +
      '<div class="gallery-grid" id="galleryGrid"></div></div>';
    chatCol.appendChild(studio);

    if (!document.getElementById("siftahLightbox")) {
      var lb = document.createElement("div");
      lb.id = "siftahLightbox"; lb.className = "lightbox";
      lb.innerHTML = '<button type="button" class="lb-close" id="lbClose">\u2715</button><img id="lbImg" alt="">';
      document.body.appendChild(lb);
      lb.onclick = function (e) { if (e.target === lb || e.target.id === "lbClose") lb.classList.remove("on"); };
    }

    studio.querySelectorAll(".studio-tabs button").forEach(function (btn) {
      btn.onclick = function () {
        studio.querySelectorAll(".studio-tabs button").forEach(function (b) { b.classList.remove("on"); });
        studio.querySelectorAll(".studio-pane").forEach(function (p) { p.classList.remove("on"); });
        btn.classList.add("on");
        var id = btn.getAttribute("data-pane") === "create" ? "paneCreate" : btn.getAttribute("data-pane") === "edit" ? "paneEdit" : "paneGallery";
        document.getElementById(id).classList.add("on");
        if (btn.getAttribute("data-pane") === "gallery") renderGallery();
      };
    });
    wireLogic();
  }

  function wireLogic() {
    if (document.getElementById("studioCreateBtn").__wired) return;
    document.getElementById("studioCreateBtn").__wired = true;

    document.getElementById("studioCreateBtn").onclick = async function () {
      var t = token();
      if (!t) { toast("Add HF token in Settings"); if (typeof openSettings === "function") openSettings(); return; }
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

    document.getElementById("galleryRefresh").onclick = renderGallery;
    document.getElementById("galleryClear").onclick = function () {
      if (!confirm("Clear entire gallery?")) return;
      if (window.siftahModes) window.siftahModes.saveGallery([]);
      renderGallery();
    };
  }

  function renderGallery() {
    var grid = document.getElementById("galleryGrid");
    if (!grid) return;
    var items = window.siftahModes ? window.siftahModes.loadGallery() : [];
    if (!items.length) {
      grid.innerHTML = '<div class="gallery-empty">No images yet. Create or edit one and it will show up here.</div>';
      return;
    }
    grid.innerHTML = "";
    items.forEach(function (item) {
      var card = document.createElement("div");
      card.className = "gallery-card";
      card.innerHTML =
        '<img src="' + item.dataUrl + '" alt="">' +
        '<div class="meta">' + (item.prompt || item.kind || "image") + "</div>" +
        '<div class="g-actions">' +
        '<button type="button" data-act="view">View</button>' +
        '<button type="button" data-act="edit">Edit</button>' +
        '<button type="button" data-act="dl">Save</button>' +
        '<button type="button" data-act="del">Del</button></div>';
      card.querySelector('[data-act="view"]').onclick = function (e) {
        e.stopPropagation();
        document.getElementById("lbImg").src = item.dataUrl;
        document.getElementById("siftahLightbox").classList.add("on");
      };
      card.querySelector('[data-act="edit"]').onclick = function (e) {
        e.stopPropagation();
        fetch(item.dataUrl).then(function (r) { return r.blob(); }).then(function (b) {
          editSourceBlob = b;
          var thumb = document.getElementById("studioEditThumb");
          thumb.src = item.dataUrl; thumb.style.display = "block";
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
        var a = document.createElement("a"); a.href = item.dataUrl; a.download = "siftah-" + item.id + ".png"; a.click();
      };
      card.querySelector('[data-act="del"]').onclick = function (e) {
        e.stopPropagation();
        var next = (window.siftahModes ? window.siftahModes.loadGallery() : []).filter(function (x) { return x.id !== item.id; });
        if (window.siftahModes) window.siftahModes.saveGallery(next);
        renderGallery();
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
