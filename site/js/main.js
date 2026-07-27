/* ==========================================================
   MAIN SCRIPT
   ----------------------------------------------------------
   Site behavior: navigation, grade ruler/grid, library tabs,
   filtering, rendering resource cards, scroll reveal, and the
   contact form confirmation message.

   Depends on GRADES and RESOURCES from data.js — make sure
   data.js is loaded in index.html BEFORE this file.
   ========================================================== */

(function(){
  "use strict";

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------- Mobile nav ---------------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');
  navToggle.addEventListener('click', function(){
    var open = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  primaryNav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  


  var TYPE_LABEL = {video:"Video", audio:"Audio", image:"Photo", pdf:"PDF"};

  /* Duotone palettes cycled for poster/frame placeholder art (used only
     until a real thumbnail/photo file is supplied) */
  var PALETTES = [
    ["#2B4736","#16233F"],
    ["#16233F","#B23A2E"],
    ["#A87D3F","#16233F"],
    ["#2B4736","#A87D3F"],
    ["#B23A2E","#1E3527"]
  ];
  function paletteFor(i){
    var p = PALETTES[i % PALETTES.length];
    return "linear-gradient(155deg,"+p[0]+" 0%,"+p[1]+" 100%)";
  }
  var PLAY_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 6.5v11l9-5.5-9-5.5Z" fill="#16233F"/></svg>';
  var DL_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" stroke="#B23A2E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DL_ICON_WHITE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------------- Build grade ruler (hero) ---------------- */
  var ruler = document.getElementById('gradeRuler');
  var rulerCaption = document.getElementById('rulerCaption');
  GRADES.forEach(function(g){
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = '<span class="tick"></span><span class="num">'+g.n+'</span>';
    btn.addEventListener('click', function(){
      ruler.querySelectorAll('button').forEach(function(b){ b.setAttribute('aria-pressed','false'); });
      btn.setAttribute('aria-pressed','true');
      rulerCaption.innerHTML = '<strong>Grade '+g.n+':</strong> '+g.desc;
      setActiveGrade(g.n);
      document.getElementById('grades').scrollIntoView({behavior:'smooth', block:'start'});
    });
    ruler.appendChild(btn);
  });

  /* ---------------- Build grade grid ---------------- */
  var gradeGrid = document.getElementById('gradeGrid');
  var gradeChips = {};
  GRADES.forEach(function(g){
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'grade-chip';
    card.innerHTML =
      '<div class="g-num mono">GRADE '+g.n+'</div>'+
      '<div class="g-title">'+g.title+'</div>'+
      '<p class="g-desc">'+g.desc+'</p>';
    card.addEventListener('click', function(){
      setActiveGrade(g.n);
      gradeFilter.value = String(g.n);
      renderResources();
      document.getElementById('library').scrollIntoView({behavior:'smooth', block:'start'});
    });
    gradeGrid.appendChild(card);
    gradeChips[g.n] = card;
  });

  function setActiveGrade(n){
    Object.keys(gradeChips).forEach(function(k){
      gradeChips[k].classList.toggle('is-active', Number(k) === n);
    });
  }

  /* ---------------- Grade filter dropdowns (library + contact form) ---------------- */
  var gradeFilter = document.getElementById('gradeFilter');
  var formGradeSelect = document.getElementById('fGrade');
  GRADES.forEach(function(g){
    var o1 = document.createElement('option');
    o1.value = String(g.n); o1.textContent = g.title;
    gradeFilter.appendChild(o1);

    var o2 = document.createElement('option');
    o2.value = g.title; o2.textContent = g.title;
    formGradeSelect.appendChild(o2);
  });
  gradeFilter.addEventListener('change', renderResources);

  /* ---------------- Library tabs ---------------- */
  var activeType = 'video';
  var tabButtons = document.querySelectorAll('#libraryTabs .tab-btn');
  tabButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      tabButtons.forEach(function(b){
        b.classList.remove('is-active');
        b.setAttribute('aria-selected','false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected','true');
      activeType = btn.dataset.type;
      renderResources();
    });
  });

  function artFor(i, thumb, tag){
    // Renders a real thumbnail if one is supplied; falls back to a
    // generated duotone placeholder (with a faint grade watermark)
    // so the gallery still looks finished before real files exist.
    if(thumb){
      return '<img src="'+thumb+'" alt="" loading="lazy" onerror="this.parentElement.style.backgroundImage=\''+paletteFor(i).replace(/'/g,"\\'")+'\'; this.remove();">';
    }
    return '';
  }

  function renderResources(){
    var grid = document.getElementById('resourceGrid');
    var wrap = document.querySelector('.tab-panel-wrap');
    wrap.setAttribute('data-type', activeType);
    grid.className = 'resource-grid' + (activeType === 'image' ? ' type-image' : '');
    grid.innerHTML = '';
    var gradeVal = gradeFilter.value;
    var items = RESOURCES.filter(function(r){
      if(r.type !== activeType) return false;
      if(gradeVal !== 'all' && String(r.grade) !== gradeVal) return false;
      return true;
    });

    if(items.length === 0){
      var empty = document.createElement('div');
      empty.className = 'empty-note';
      empty.textContent = 'No ' + TYPE_LABEL[activeType].toLowerCase() + ' files for this grade yet. Add them to the RESOURCES list in the code, or choose "All grades".';
      grid.appendChild(empty);
      return;
    }

    items.forEach(function(r, i){
      var card = document.createElement('div');

      if(r.type === 'video'){
        card.className = 'poster-card reveal is-visible';
        card.innerHTML =
          '<div class="poster-art" style="background-image:'+(r.thumb ? 'none' : paletteFor(i))+'">'+ artFor(i, r.thumb) +'</div>'+
          '<span class="poster-badge mono">Grade '+r.grade+'</span>'+
          '<a class="poster-play" href="'+r.file+'" download aria-label="Download '+r.title+'"><span>'+PLAY_ICON+'</span></a>'+
          '<div class="poster-overlay">'+
            '<h4>'+r.title+'</h4>'+
            '<span class="meta">'+r.meta+'</span>'+
            '<a class="dl" href="'+r.file+'" download>'+DL_ICON+' Download</a>'+
          '</div>';
      } else if(r.type === 'image'){
        card.className = 'frame-card reveal is-visible';
        card.innerHTML =
          '<div class="frame-art" style="background-image:'+(r.thumb ? 'none' : paletteFor(i))+'">'+ artFor(i, r.thumb) +'</div>'+
          '<a class="dl" href="'+r.file+'" download aria-label="Download '+r.title+'">'+DL_ICON_WHITE+'</a>'+
          '<div class="frame-caption">'+
            '<h4>'+r.title+'</h4>'+
            '<span class="meta">Grade '+r.grade+' · '+r.meta+'</span>'+
          '</div>';
      } else if(r.type === 'audio'){
        card.className = 'resource-card reveal is-visible';
        var bars = '';
        for(var b=0; b<18; b++){ bars += '<span style="height:'+(6+Math.round(Math.sin(b*1.4+i)*8+8))+'px"></span>'; }
        card.innerHTML =
          '<span class="kind mono">Audio · Grade '+r.grade+'</span>'+
          '<h4>'+r.title+'</h4>'+
          '<div class="waveform">'+bars+'</div>'+
          '<span class="meta">'+r.meta+'</span>'+
          '<a class="dl" href="'+r.file+'" download>'+DL_ICON+' Download</a>';
      } else {
        card.className = 'resource-card reveal is-visible';
        card.innerHTML =
          '<span class="kind mono">PDF · Grade '+r.grade+'</span>'+
          '<h4>'+r.title+'</h4>'+
          '<span class="meta">'+r.meta+'</span>'+
          '<a class="dl" href="'+r.file+'" download>'+DL_ICON+' Download</a>';
      }
      grid.appendChild(card);
    });
  }
  renderResources();

  /* ---------------- Scroll reveal ---------------- */
  var revealTargets = document.querySelectorAll('.section-head, .about-card, .service-list li, .grade-chip, .index-card, .contact-info');
  revealTargets.forEach(function(el){ el.classList.add('reveal'); });
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
    revealTargets.forEach(function(el){ io.observe(el); });
  } else {
    revealTargets.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------------- Contact form feedback ----------------
     FormSubmit handles the actual send; this just gives a friendly
     confirmation instead of a hard page redirect. */
  var form = document.getElementById('contactForm');
  var formMsg = document.getElementById('formMsg');
  form.addEventListener('submit', function(e){
    if(form.action.indexOf('YOUR-EMAIL@example.com') !== -1){
      e.preventDefault();
      formMsg.textContent = 'Almost there — the academy needs to set a real email address in the form before messages can be sent. Please try again soon.';
      formMsg.className = 'form-msg show';
      return;
    }
    // Let FormSubmit handle real submissions normally.
  });
})();
