/* Siftah file actions: select, 3-dot menu, rename, highlight, clone, multi */
(function () {
  "use strict";
  var selected = new Set();
  var highlights = {};
  try { highlights = JSON.parse(localStorage.getItem("siftah_highlights") || "{}") || {}; } catch (e) { highlights = {}; }
  function saveHl() { localStorage.setItem("siftah_highlights", JSON.stringify(highlights)); }
  function key(folder, name) { return (folder || "") + "\0" + name; }
  function parseKey(k) { var i = k.indexOf("\0"); return { folder: k.slice(0, i), name: k.slice(i + 1) }; }

  function ensureMenu() {
    var m = document.getElementById("fileCtxMenu");
    if (m) return m;
    m = document.createElement("div");
    m.id = "fileCtxMenu";
    m.className = "file-ctx-menu";
    m.innerHTML =
      '<div class="ctx-label" id="ctxTargetLabel">File</div>' +
      '<button type="button" data-act="rename">✏️ Rename</button>' +
      '<button type="button" data-act="clone">📄 Quick clone</button>' +
      '<button type="button" data-act="copy">📋 Copy contents</button>' +
      '<button type="button" data-act="move">📁 Move to…</button>' +
      '<div class="sep"></div>' +
      '<div class="ctx-label">Highlight</div>' +
      '<div class="hl-swatches">' +
      '<button type="button" data-hl="red" title="Red"></button>' +
      '<button type="button" data-hl="orange" title="Orange"></button>' +
      '<button type="button" data-hl="yellow" title="Yellow"></button>' +
      '<button type="button" data-hl="green" title="Green"></button>' +
      '<button type="button" data-hl="blue" title="Blue"></button>' +
      '<button type="button" data-hl="purple" title="Purple"></button>' +
      '<button type="button" data-hl="" title="None"></button>' +
      "</div>" +
      '<div class="sep"></div>' +
      '<button type="button" class="danger" data-act="delete">🗑 Delete</button>';
    document.body.appendChild(m);
    m.addEventListener("click", onMenuClick);
    document.addEventListener("click", function (e) {
      if (!m.classList.contains("show")) return;
      if (m.contains(e.target)) return;
      if (e.target.closest && e.target.closest(".more-btn")) return;
      hideMenu();
    });
    return m;
  }
  var menuTargets = [];
  function hideMenu() {
    var m = document.getElementById("fileCtxMenu");
    if (m) m.classList.remove("show");
    menuTargets = [];
  }
  function showMenu(x, y, targets) {
    var m = ensureMenu();
    menuTargets = targets.slice();
    var label = document.getElementById("ctxTargetLabel");
    if (label) {
      label.textContent = targets.length > 1 ? targets.length + " files selected" : targets[0].name;
    }
    m.classList.add("show");
    var pad = 8;
    var w = m.offsetWidth || 180;
    var h = m.offsetHeight || 280;
    var left = Math.min(x, window.innerWidth - w - pad);
    var top = Math.min(y, window.innerHeight - h - pad);
    m.style.left = Math.max(pad, left) + "px";
    m.style.top = Math.max(pad, top) + "px";
  }

  function getContent(folder, name) {
    if (typeof getFileContent === "function") return getFileContent(folder, name);
    var p = window.project;
    if (!p) return null;
    return folder ? (p.folders[folder] && p.folders[folder].files[name]) : p.files[name];
  }
  function uniqueCloneName(folder, name) {
    var dot = name.lastIndexOf(".");
    var base = dot >= 0 ? name.slice(0, dot) : name;
    var ext = dot >= 0 ? name.slice(dot) : "";
    var i = 1;
    var candidate = base + i + ext;
    while (getContent(folder, candidate) != null) {
      i++;
      candidate = base + i + ext;
    }
    return candidate;
  }

  function onMenuClick(e) {
    var hl = e.target.closest("[data-hl]");
    if (hl) {
      var color = hl.getAttribute("data-hl");
      menuTargets.forEach(function (t) {
        var k = key(t.folder, t.name);
        if (color) highlights[k] = color;
        else delete highlights[k];
      });
      saveHl();
      hideMenu();
      if (typeof renderFilesTree === "function") renderFilesTree();
      if (typeof showToast === "function") showToast(color ? "Highlighted" : "Highlight cleared");
      return;
    }
    var btn = e.target.closest("[data-act]");
    if (!btn) return;
    var act = btn.getAttribute("data-act");
    var targets = menuTargets.slice();
    hideMenu();
    if (!targets.length) return;

    if (act === "rename") {
      if (targets.length !== 1) {
        if (typeof showToast === "function") showToast("Rename one file at a time");
        return;
      }
      var t = targets[0];
      var next = prompt("Rename file:", t.name);
      if (!next || !next.trim()) return;
      next = next.trim().replace(/[^\w.\- ]+/g, "").replace(/\s+/g, "-");
      if (!next || next === t.name) return;
      if (getContent(t.folder, next) != null) {
        if (typeof showToast === "function") showToast("Name already exists");
        return;
      }
      var content = getContent(t.folder, t.name);
      if (content == null) return;
      if (typeof putFile === "function") {
        var path = t.folder ? t.folder + "/" + next : next;
        if (typeof deleteFile === "function") deleteFile(t.folder, t.name);
        putFile(path, content, true);
        var ok = key(t.folder, t.name);
        if (highlights[ok]) {
          highlights[key(t.folder, next)] = highlights[ok];
          delete highlights[ok];
          saveHl();
        }
        selected.delete(ok);
      }
      return;
    }

    if (act === "clone") {
      targets.forEach(function (t) {
        var content = getContent(t.folder, t.name);
        if (content == null) return;
        var neu = uniqueCloneName(t.folder, t.name);
        var path = t.folder ? t.folder + "/" + neu : neu;
        if (typeof putFile === "function") putFile(path, content, true);
      });
      if (typeof showToast === "function") showToast("Cloned " + targets.length + " file(s)");
      return;
    }

    if (act === "copy") {
      var texts = targets.map(function (t) {
        var c = getContent(t.folder, t.name);
        return c == null ? "" : c;
      }).filter(Boolean);
      var blob = texts.join("\n\n/* ---- */\n\n");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(blob).then(
          function () { if (typeof showToast === "function") showToast("Copied"); },
          function () { if (typeof showToast === "function") showToast("Copy failed"); }
        );
      }
      return;
    }

    if (act === "move") {
      var p = window.project || {};
      var folders = Object.keys(p.folders || {}).sort();
      var dest = prompt(
        "Move to folder (leave empty for root).\nExisting: " + (folders.join(", ") || "(none)"),
        targets[0].folder || ""
      );
      if (dest === null) return;
      dest = String(dest).trim().replace(/[^\w\- .]/g, "").slice(0, 40);
      targets.forEach(function (t) {
        if ((t.folder || "") === dest) return;
        if (typeof moveFile === "function") moveFile(t.folder || "", t.name, dest);
        var ok = key(t.folder, t.name);
        if (highlights[ok]) {
          highlights[key(dest, t.name)] = highlights[ok];
          delete highlights[ok];
        }
        selected.delete(ok);
      });
      saveHl();
      if (typeof renderFilesTree === "function") renderFilesTree();
      updateSelBar();
      if (typeof showToast === "function") showToast("Moved");
      return;
    }

    if (act === "delete") {
      var msg = targets.length > 1 ? "Delete " + targets.length + " files?" : 'Delete "' + targets[0].name + '"?';
      if (!confirm(msg)) return;
      targets.forEach(function (t) {
        if (typeof deleteFile === "function") deleteFile(t.folder || "", t.name);
        var ok = key(t.folder, t.name);
        delete highlights[ok];
        selected.delete(ok);
      });
      saveHl();
      updateSelBar();
      if (typeof showToast === "function") showToast("Deleted");
      return;
    }
  }

  function updateSelBar() {
    var bar = document.getElementById("selBar");
    if (!bar) {
      var tree = document.getElementById("filesTree");
      if (!tree || !tree.parentNode) return;
      bar = document.createElement("div");
      bar.id = "selBar";
      bar.className = "sel-bar";
      bar.innerHTML =
        '<span class="count" id="selCount">0</span> selected' +
        '<button type="button" id="selClear">Clear</button>' +
        '<button type="button" id="selMenu">⋯ Actions</button>';
      tree.parentNode.insertBefore(bar, tree);
      document.getElementById("selClear").onclick = function () {
        selected.clear();
        if (typeof renderFilesTree === "function") renderFilesTree();
        updateSelBar();
      };
      document.getElementById("selMenu").onclick = function (e) {
        if (!selected.size) return;
        var list = [];
        selected.forEach(function (k) { list.push(parseKey(k)); });
        showMenu(e.clientX, e.clientY, list);
      };
    }
    var n = selected.size;
    bar.classList.toggle("show", n > 0);
    var c = document.getElementById("selCount");
    if (c) c.textContent = String(n);
  }

  function enhancedFileRowHtml(folder, name, flash) {
    var path = folder ? folder + "/" + name : name;
    var k = key(folder, name);
    var hl = highlights[k] || "";
    var isSel = selected.has(k);
    var classes = "tree-file" + (flash ? " flash" : "") + (isSel ? " selected" : "") + (hl ? " hl-" + hl : "");
    return (
      '<div class="' + classes + '" data-folder="' + escapeHtml(folder) + '" data-name="' + escapeHtml(name) + '">' +
      '<div class="tree-file-row" draggable="true" data-drag-folder="' + escapeHtml(folder) + '" data-drag-name="' + escapeHtml(name) + '">' +
      '<button type="button" class="sel-circle" title="Select" data-sel-folder="' + escapeHtml(folder) + '" data-sel-name="' + escapeHtml(name) + '"></button>' +
      '<span class="name" data-preview-folder="' + escapeHtml(folder) + '" data-preview-name="' + escapeHtml(name) + '" title="' + escapeHtml(path) + '">📄 ' + escapeHtml(name) + "</span>" +
      '<div class="tree-actions">' +
      '<button type="button" title="Download" data-dl-folder="' + escapeHtml(folder) + '" data-dl-name="' + escapeHtml(name) + '">⬇</button>' +
      '<button type="button" class="more-btn" title="More" data-more-folder="' + escapeHtml(folder) + '" data-more-name="' + escapeHtml(name) + '">⋯</button>' +
      '<button type="button" class="danger" title="Delete" data-del-file-folder="' + escapeHtml(folder) + '" data-del-file-name="' + escapeHtml(name) + '">🗑</button>' +
      "</div></div></div>"
    );
  }

  function patchRender() {
    if (typeof fileRowHtml === "function" && !fileRowHtml.__siftahEnhanced) {
      window.fileRowHtml = enhancedFileRowHtml;
      window.fileRowHtml.__siftahEnhanced = true;
    }
    if (typeof renderFilesTree === "function" && !renderFilesTree.__siftahEnhanced) {
      var _render = renderFilesTree;
      window.renderFilesTree = function (flashPath) {
        window.fileRowHtml = enhancedFileRowHtml;
        _render(flashPath);
        bindExtraTreeEvents();
        updateSelBar();
      };
      window.renderFilesTree.__siftahEnhanced = true;
    }
  }

  function bindExtraTreeEvents() {
    var tree = document.getElementById("filesTree");
    if (!tree) return;
    tree.querySelectorAll("[data-sel-name]").forEach(function (el) {
      el.onclick = function (e) {
        e.stopPropagation();
        var f = el.getAttribute("data-sel-folder") || "";
        var n = el.getAttribute("data-sel-name");
        var k = key(f, n);
        if (selected.has(k)) selected.delete(k);
        else selected.add(k);
        if (typeof renderFilesTree === "function") renderFilesTree();
        else {
          el.closest(".tree-file").classList.toggle("selected");
          updateSelBar();
        }
      };
    });
    tree.querySelectorAll("[data-more-name]").forEach(function (el) {
      el.onclick = function (e) {
        e.stopPropagation();
        var f = el.getAttribute("data-more-folder") || "";
        var n = el.getAttribute("data-more-name");
        var k = key(f, n);
        var targets;
        if (selected.size && selected.has(k)) {
          targets = [];
          selected.forEach(function (sk) { targets.push(parseKey(sk)); });
        } else if (selected.size > 1) {
          targets = [];
          selected.forEach(function (sk) { targets.push(parseKey(sk)); });
          if (!selected.has(k)) targets.push({ folder: f, name: n });
        } else {
          targets = [{ folder: f, name: n }];
        }
        showMenu(e.clientX, e.clientY, targets);
      };
    });
  }

  function boot() {
    patchRender();
    ensureMenu();
    if (typeof renderFilesTree === "function") renderFilesTree();
    updateSelBar();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 80); });
  else setTimeout(boot, 80);
})();
