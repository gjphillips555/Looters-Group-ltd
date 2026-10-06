(function(){
  const parts = ["app_part0.js","app_part1.js","app_part2.js"];
  let i = 0, code = "";
  function next(){
    if (i >= parts.length) { const s = document.createElement("script"); s.textContent = code; document.body.appendChild(s); return; }
    fetch("./" + parts[i++]).then(r => r.text()).then(t => { code += t; next(); }).catch(e => console.error("Siftah load failed", e));
  }
  next();
})();
