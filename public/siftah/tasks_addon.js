/* Siftah v1.5 tasks + menu + google + smart +Project naming */
(function(){
  if (typeof project === "undefined") return;
  project.activeTask = project.activeTask || "";

  function listTasks(){ return Object.keys(project.folders||{}).sort(); }

  window.renderTaskSelect = function(){
    const sel = document.getElementById("taskSelect");
    if (!sel) return;
    const tasks = listTasks();
    const cur = project.activeTask || "";
    let html = '<option value="">— root (no task) —</option>';
    for (const t of tasks) html += '<option value="'+escapeHtml(t)+'"'+(t===cur?' selected':'')+'>'+escapeHtml(t)+'</option>';
    sel.innerHTML = html;
  };

  window.setActiveTask = function(name){
    project.activeTask = name || "";
    saveProject();
    if (typeof renderFilesTree === "function") renderFilesTree();
    renderTaskSelect();
  };

  window.createTask = function(name){
    const clean = String(name||"").trim().replace(/[^\w\- .]/g,"").replace(/\s+/g,"-").slice(0,40);
    if (!clean) return null;
    ensureFolder(clean);
    project.activeTask = clean;
    saveProject();
    if (typeof renderFilesTree === "function") renderFilesTree();
    renderTaskSelect();
    showToast('Task "'+clean+'" active');
    return clean;
  };

  function assembleBucket(filename){
    const ext = (filename.split(".").pop()||"").toLowerCase();
    if (["html","htm","svg"].includes(ext)) return "public";
    if (["css","scss","sass","less"].includes(ext)) return "styles";
    if (["js","jsx","ts","tsx","mjs","cjs","vue","svelte"].includes(ext)) return "src";
    if (["py","pyw","ipynb"].includes(ext)) return "src";
    if (["json","yml","yaml","toml","env","ini"].includes(ext)) return "config";
    if (["md","txt","rst"].includes(ext)) return "docs";
    if (["sql"].includes(ext)) return "db";
    if (["sh","bash","ps1","bat"].includes(ext)) return "scripts";
    return "other";
  }

  window.autoAssemble = function(){
    const task = project.activeTask;
    if (!task){ showToast("Select or create a Task first"); return; }
    ensureFolder(task);
    const files = Object.assign({}, (project.folders[task]&&project.folders[task].files)||{});
    const keys = Object.keys(files);
    if (!keys.length){ showToast("No files in this task yet"); return; }
    let moved = 0;
    for (const name of keys){
      const content = files[name];
      const bucket = assembleBucket(name);
      let baseName = name;
      const pref = name.match(/^(public|styles|src|config|docs|db|scripts|other)__(.+)$/);
      if (pref) baseName = pref[2];
      const destFolder = ensureFolder(task + "__" + bucket);
      let destName = baseName;
      if (project.folders[destFolder].files[destName] != null && project.folders[destFolder].files[destName] !== content){
        const dot = destName.lastIndexOf(".");
        const b = dot>=0?destName.slice(0,dot):destName;
        const e = dot>=0?destName.slice(dot):"";
        let i=2, candidate=b+i+e;
        while (project.folders[destFolder].files[candidate]!=null){ i++; candidate=b+i+e; }
        destName = candidate;
      }
      project.folders[destFolder].files[destName] = content;
      delete project.folders[task].files[name];
      moved++;
    }
    saveProject();
    if (typeof renderFilesTree === "function") renderFilesTree();
    showToast("Assembled "+moved+" file(s)");
  };

  function looksLikeFile(s){
    if (!s) return false;
    s = String(s).trim().replace(/^[`'"*#_:\-\s]+|[`'"*#_:\-\s]+$/g,"");
    if (!/^[\w./\-]+$/.test(s)) return false;
    return /\.[a-z0-9]{1,12}$/i.test(s) || (/[\/]/.test(s) && s.length < 120);
  }
  function cleanFile(s){
    return String(s||"").trim()
      .replace(/^[`'"*#:\-\s]+/, "")
      .replace(/[`'"*#:\-\s]+$/, "")
      .replace(/^\.\//, "")
      .replace(/^(?:File|Filename|Path|Name)\s*:\s*/i, "");
  }
  function extractNameFromCode(code){
    if (!code) return null;
    const lines = code.split(/\n/).slice(0, 8);
    for (const line of lines){
      const t = line.trim();
      let m =
        t.match(/^\/\/\s*([^\s*]+?\.[a-z0-9]{1,12})\s*$/i) ||
        t.match(/^#\s*([^\s]+?\.[a-z0-9]{1,12})\s*$/i) ||
        t.match(/^\/\*\s*([^\s*]+?\.[a-z0-9]{1,12})\s*\*\//i) ||
        t.match(/^<!--\s*([^\s>]+?\.[a-z0-9]{1,12})\s*-->/i) ||
        t.match(/^(?:\/\/|#|--)\s*(?:file|filename|path)\s*[:=]\s*[`']?([^\s`']+)/i) ||
        t.match(/^(?:file|filename|path)\s*[:=]\s*[`']?([^\s`']+)/i);
      if (m && looksLikeFile(m[1])) return cleanFile(m[1]).split("/").pop();
    }
    return null;
  }
  function extractNameNearBlock(btn){
    try {
      const block = btn.closest(".code-block");
      if (!block) return null;
      const langEl = block.querySelector(".lang");
      if (langEl){
        const lab = cleanFile(langEl.textContent||"");
        if (looksLikeFile(lab)) return lab.split("/").pop();
      }
      const bubble = btn.closest(".bubble");
      if (bubble){
        let node = block.previousSibling;
        const chunks = [];
        while (node && chunks.length < 6){
          const text = (node.textContent||"").trim();
          if (text) chunks.unshift(text);
          node = node.previousSibling;
        }
        const before = chunks.join("\n");
        const patterns = [
          /(?:file|filename|path)\s*[:=]\s*[`']?([\w./\-]+\.[a-z0-9]{1,12})/i,
          /(?:create|write|save|update|edit|here(?:'s| is)|following)\s+(?:the\s+)?(?:file\s+)?[`'*]*([\w./\-]+\.[a-z0-9]{1,12})/i,
          /[`']([\w./\-]+\.[a-z0-9]{1,12})[`']/,
          /\*\*([^*\s]+\.[a-z0-9]{1,12})\*\*/,
          /(?:^|\n)\s*#+\s*[`']?([\w./\-]+\.[a-z0-9]{1,12})[`']?\s*$/m
        ];
        for (const re of patterns){
          const m = before.match(re);
          if (m && looksLikeFile(m[1])) return cleanFile(m[1]).split("/").pop();
        }
      }
    } catch(e){}
    return null;
  }
  function defaultGuess(lang){
    const used = new Set([
      ...Object.keys(project.files||{}),
      ...Object.values(project.folders||{}).flatMap(f => Object.keys(f.files||{}))
    ]);
    if (typeof guessFilename === "function") return guessFilename(lang||"txt", used);
    const map = {javascript:"js",js:"js",python:"py",py:"py",html:"html",css:"css",typescript:"ts",ts:"ts",json:"json",md:"md"};
    const ext = map[(lang||"txt").toLowerCase()] || "txt";
    const base = {html:"index",css:"styles",js:"script",javascript:"script",py:"main",python:"main",ts:"index",json:"data",md:"README"}[ (lang||"").toLowerCase() ] || "file";
    let name = base+"."+ext, i=2;
    while (used.has(name)) { name = base+i+"."+ext; i++; }
    return name;
  }

  function resolveProjectPath(btn, pre){
    let path = (btn.getAttribute("data-path")||"").trim();
    if (path && looksLikeFile(path)) return cleanFile(path).split("/").pop();
    const fromNear = extractNameNearBlock(btn);
    if (fromNear) return fromNear;
    const fromCode = extractNameFromCode(pre ? pre.textContent : "");
    if (fromCode) return fromCode;
    const lang = btn.getAttribute("data-lang") || "txt";
    const guess = defaultGuess(lang);
    const entered = prompt("Filename for this code:", guess);
    if (entered == null) return null;
    const cleaned = cleanFile(entered).replace(/[^\w./\-]+/g,"").split("/").pop();
    return cleaned || guess;
  }

  document.addEventListener("click", function(e){
    const btn = e.target && e.target.closest && e.target.closest(".add-btn");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const pre = document.getElementById(btn.getAttribute("data-add"));
    if (!pre) return;
    const path = resolveProjectPath(btn, pre);
    if (!path) return;
    const block = btn.closest(".code-block");
    if (block){
      const langEl = block.querySelector(".lang");
      if (langEl) langEl.textContent = path;
      btn.setAttribute("data-path", path);
    }
    putFile(path, pre.textContent||"", true);
    btn.textContent = "Added";
    setTimeout(function(){ btn.textContent = "+ Project"; }, 1200);
  }, true);

  const _putFile = window.putFile;
  if (typeof _putFile === "function") {
    window.putFile = function(path, content, flash){
      path = String(path||"").replace(/^\/+/,"").replace(/\\/g,"/");
      let parts = path.split("/").filter(Boolean);
      if (project.activeTask && parts.length===1){
        parts = [project.activeTask, parts[0]];
        path = parts.join("/");
      }
      return _putFile.call(this, path, content, flash);
    };
  }

  window.openMenu = function(){ const o=document.getElementById("menuOverlay"); if(o) o.classList.add("show"); };
  window.closeMenu = function(){ const o=document.getElementById("menuOverlay"); if(o) o.classList.remove("show"); };

  function wire(){
    const menuBtn = document.getElementById("menuBtn");
    if (menuBtn) menuBtn.onclick = openMenu;
    const menuClose = document.getElementById("menuClose");
    if (menuClose) menuClose.onclick = closeMenu;
    const overlay = document.getElementById("menuOverlay");
    if (overlay) overlay.addEventListener("click", function(e){ if(e.target===overlay) closeMenu(); });
    const ms = document.getElementById("menuSettings");
    if (ms) ms.onclick = function(){ closeMenu(); if(typeof openSettings==="function") openSettings(); };
    const mf = document.getElementById("menuForum");
    if (mf) mf.onclick = function(){ showToast("Siftah Forum — coming soon"); };
    const m3 = document.getElementById("menu3d");
    if (m3) m3.onclick = function(){ showToast("3D Blueprints — coming soon"); };

    const btnNewTask = document.getElementById("btnNewTask");
    if (btnNewTask) btnNewTask.onclick = function(){
      const name = prompt("Task name (software / project):");
      if (name) createTask(name);
    };
    const taskSelect = document.getElementById("taskSelect");
    if (taskSelect) taskSelect.onchange = function(e){ setActiveTask(e.target.value); };
    const btnAssemble = document.getElementById("btnAutoAssemble");
    if (btnAssemble) btnAssemble.onclick = autoAssemble;

    const btnG = document.getElementById("btnGoogleSignIn");
    if (btnG) btnG.onclick = signInWithGoogle;
    const btnOut = document.getElementById("btnSignOut");
    if (btnOut) btnOut.onclick = signOut;

    renderTaskSelect();
  }

  let firebaseApp=null, firebaseAuth=null, currentUser=null;

  function loadScript(src){
    return new Promise(function(resolve,reject){
      if (document.querySelector('script[src="'+src+'"]')) return resolve();
      const s=document.createElement("script"); s.src=src; s.async=true;
      s.onload=resolve; s.onerror=reject; document.head.appendChild(s);
    });
  }

  function updateAuthUI(){
    const signedIn = !!currentUser;
    const so = document.getElementById("menuSignedOut");
    const si = document.getElementById("menuSignedIn");
    if (so) so.style.display = signedIn ? "none" : "block";
    if (si) si.style.display = signedIn ? "block" : "none";
    const chip = document.getElementById("userChip");
    if (signedIn){
      const dn = document.getElementById("menuDisplayName");
      const em = document.getElementById("menuEmail");
      if (dn) dn.textContent = currentUser.displayName || "User";
      if (em) em.textContent = currentUser.email || "";
      if (currentUser.photoURL){
        const a1=document.getElementById("menuAvatar"); if(a1) a1.src=currentUser.photoURL;
        const a2=document.getElementById("userAvatar"); if(a2) a2.src=currentUser.photoURL;
      }
      const un=document.getElementById("userName");
      if (un) un.textContent = (currentUser.displayName||currentUser.email||"User").split(" ")[0];
      if (chip) chip.style.display = "flex";
    } else if (chip) chip.style.display = "none";
  }

  window.initFirebase = async function(configStr){
    if (!configStr || !String(configStr).trim()) return false;
    let config;
    try { config = JSON.parse(configStr); } catch { showToast("Invalid Firebase JSON"); return false; }
    if (!config.apiKey || !config.authDomain){ showToast("Firebase needs apiKey + authDomain"); return false; }
    try {
      await loadScript("https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js");
      await loadScript("https://www.gstatic.com/firebasejs/10.14.0/firebase-auth-compat.js");
      if (!firebaseApp) firebaseApp = firebase.initializeApp(config);
      firebaseAuth = firebase.auth();
      firebaseAuth.onAuthStateChanged(function(user){
        if (user) currentUser = { uid:user.uid, displayName:user.displayName, email:user.email, photoURL:user.photoURL };
        else currentUser = null;
        updateAuthUI();
      });
      return true;
    } catch(e){ console.error(e); showToast("Firebase init failed"); return false; }
  };

  window.signInWithGoogle = async function(){
    const s = typeof loadSettings==="function" ? loadSettings() : {};
    const cfg = (s && s.firebaseConfig) || localStorage.getItem("siftah_firebase") || "";
    if (!cfg){ if(typeof openSettings==="function") openSettings(); showToast("Paste Firebase config in Settings first"); return; }
    const ok = await initFirebase(cfg);
    if (!ok || !firebaseAuth) return;
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebaseAuth.signInWithPopup(provider);
      showToast("Signed in");
      closeMenu();
    } catch(e){ console.error(e); showToast(e.message||"Sign-in failed"); }
  };

  window.signOut = async function(){
    try { if (firebaseAuth) await firebaseAuth.signOut(); } catch(e){}
    currentUser = null;
    updateAuthUI();
    showToast("Signed out");
  };

  const _apply = window.applySettingsFromUI;
  if (typeof _apply === "function") {
    window.applySettingsFromUI = function(){
      _apply();
      const ta = document.getElementById("firebaseConfig");
      if (ta) {
        localStorage.setItem("siftah_firebase", ta.value.trim());
        initFirebase(ta.value.trim());
      }
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else setTimeout(wire, 50);

  const cfg = localStorage.getItem("siftah_firebase") || "";
  if (cfg) setTimeout(function(){ initFirebase(cfg); }, 100);
})();
