/* 導覽列「精選文章」NEW 標示
   最新文章日期自動取自 posts.html 文章卡片的資料夾名稱（精選文章/YYYYMMDD_主題/），
   上線 DAYS 天內才顯示。新增文章只要照常更新 posts.html，不用改這支。
   想強制關掉：把 FORCE 改成 'off'；強制打開：改成 'on'。 */
(function(){
  var DAYS = 30;
  var FORCE = '';

  var link = document.querySelector('.nav-links a[href$="posts.html"], .snav-links a[href$="posts.html"]');
  if(!link || FORCE === 'off') return;
  var nav = link.closest('.nav, .snav');

  var css = document.createElement('style');
  css.textContent =
    '.nav-new{display:inline-block; margin-left:5px; padding:1px 6px; border-radius:999px; background:var(--main); color:var(--paper);' +
    ' font-size:.62rem; font-weight:700; letter-spacing:.06em; line-height:1.5; vertical-align:2px; white-space:nowrap; font-family:Arial,"Noto Sans TC",sans-serif}' +
    '.has-new .menu-btn, .has-new .snav-menu{position:relative}' +
    '.has-new .menu-btn::after, .has-new .snav-menu::after{content:""; position:absolute; top:7px; right:7px; width:8px; height:8px; border-radius:50%; background:var(--main); box-shadow:0 0 0 2px var(--lav)}' +
    '.has-new.open .menu-btn::after, .has-new.open .snav-menu::after{display:none}';
  document.head.appendChild(css);

  function latest(html){
    var re = /精選文章\/(20\d{6})_/g, m, max = '';
    while((m = re.exec(html))) if(m[1] > max) max = m[1];
    return max;
  }
  function show(ymd){
    if(FORCE !== 'on'){
      if(!ymd) return;
      var d = new Date(+ymd.slice(0,4), +ymd.slice(4,6) - 1, +ymd.slice(6,8));
      if((Date.now() - d) / 864e5 > DAYS) return;
    }
    if(link.querySelector('.nav-new')) return;
    var b = document.createElement('span');
    b.className = 'nav-new';
    b.textContent = 'NEW';
    link.appendChild(b);
    link.setAttribute('aria-label', '精選文章（有新文章）');
    if(nav) nav.classList.add('has-new');
  }

  if(/posts\.html$/.test(location.pathname)){
    show(latest(document.body.innerHTML));
  } else {
    fetch(link.href).then(function(r){ return r.ok ? r.text() : ''; })
      .then(function(t){ show(latest(t)); })
      .catch(function(){});
  }
})();
