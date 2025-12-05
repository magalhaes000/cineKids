const API_MOVIES = "/api/movies";
const API_GENRES = "/api/genres";

function id(){ return Math.random().toString(36).slice(2,9) }
function escapeHtml(str){
  if(!str) return "";
  return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

const content = document.getElementById("content");
const genreChips = document.getElementById("genre-chips");
const filterKidsEl = document.getElementById("filter-kids");
const heroSlider = document.getElementById("heroSlider");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const movieForm = document.getElementById("movie-form");
const inputId = document.getElementById("movie-id");
const inputTitle = document.getElementById("title");
const inputGenres = document.getElementById("genres");
const inputImage = document.getElementById("image");
const inputIsKids = document.getElementById("isKids");

const openAddBtn = document.getElementById("open-add-movie");
const closeModalBtn = document.getElementById("close-modal");
const cancelBtn = document.getElementById("cancel");

const openRegisterBtn = document.getElementById("open-register");
const modalUser = document.getElementById("modal-user");
const closeUserModal = document.getElementById("close-user-modal");
const userForm = document.getElementById("user-form");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userBadge = document.getElementById("user-badge");
const userInitials = document.getElementById("user-initials");
const cancelUser = document.getElementById("cancel-user");

const resetBtn = document.getElementById("reset-data");
const openGenPageBtn = document.getElementById("open-gen-page");

let movies = [];
let genres = [];
let filterGenre = null;
let filterKids = false;

document.addEventListener("DOMContentLoaded", () => {
  attachEvents();
  loadAll();
});

function attachEvents(){
  openAddBtn.onclick = () => openMovieModal();
  closeModalBtn.onclick = closeModal;
  cancelBtn.onclick = closeModal;
  movieForm.onsubmit = handleMovieForm;

  openRegisterBtn.onclick = ()=> modalUser.classList.remove("hidden");
  closeUserModal.onclick = ()=> modalUser.classList.add("hidden");
  cancelUser.onclick = ()=> modalUser.classList.add("hidden");
  userForm.onsubmit = handleUserForm;

  filterKidsEl.onchange = (e)=> { filterKids = e.target.checked; renderAll() }
  resetBtn.onclick = ()=> { if(confirm("Resetar dados para o exemplo?")) initSampleData() }

  document.querySelectorAll(".ks-modal").forEach(m=>{
    m.addEventListener("click", (e)=> { if(e.target === m) m.classList.add("hidden") })
  });

  if(openGenPageBtn) openGenPageBtn.onclick = ()=> window.location.href = "/generos";
}

function handleUserForm(e){
  e.preventDefault();
  const name = userName.value.trim();
  const email = userEmail.value.trim();
  if(!name || !email) return alert("Preencha nome e e-mail");
  const user = { name, email, created: Date.now() };
  localStorage.setItem("ks_user_v1", JSON.stringify(user));
  renderUser();
  modalUser.classList.add("hidden");
  userForm.reset();
}
function renderUser(){
  const raw = localStorage.getItem("ks_user_v1");
  if(!raw) { userBadge.hidden = true; return }
  const u = JSON.parse(raw);
  userInitials.textContent = u.name.split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase();
  userBadge.hidden = false;
}
async function loadAll(){
  await loadGenres();
  await loadMovies();
  buildChips();
  renderAll();
}

async function loadMovies(){
  try {
    const res = await fetch(API_MOVIES);
    movies = await res.json();
  } catch(e){ console.error("Erro carregar filmes", e); movies = []; }
}
async function loadGenres(){
  try {
    const res = await fetch(API_GENRES);
    genres = await res.json();
  } catch(e){ console.error("Erro carregar generos", e); genres = []; }
}

async function initSampleData(){
  const gnames = ["Animação","Família","Aventura","Documentário","Ficção","Ação"];
  for(const gn of gnames){
    if(!genres.find(g=>g.name === gn)){
      await fetch(API_GENRES, {method:"POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify({name:gn})});
    }
  }
  await loadGenres();

  if((await (await fetch(API_MOVIES)).json()).length === 0){
    const sampleMovies = [
      { title:"Encanto", genres:"Animação,Família", img:"https://picsum.photos/seed/encanto/1200/675", kids:true, featured:true },
      { title:"Toy Story", genres:"Animação,Família", img:"https://picsum.photos/seed/toystory/1200/675", kids:true, featured:true },
      { title:"Luca", genres:"Animação,Aventura", img:"https://picsum.photos/seed/luca/1200/675", kids:true, featured:false },
      { title:"Planeta Azul", genres:"Documentário,Natureza", img:"https://picsum.photos/seed/nature/1200/675", kids:true, featured:false }
    ];
    for(const s of sampleMovies){
      await fetch(API_MOVIES, {method:"POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(s)});
    }
  }
  await loadMovies();
  buildChips();
  renderAll();
}

function renderAll(){
  renderHero();
  renderSections();
  renderUser();
}

function renderHero(){
  if(!heroSlider) return;
  heroSlider.innerHTML = "";
  const featured = movies.filter(m=>m.featured).slice(0,4);
  const pool = featured.length ? featured : movies.slice(0,3);
  pool.forEach((f,i)=>{
    const s = document.createElement("div");
    s.className = i === 0 ? "slide" : "slide small";
    s.style.backgroundImage = `url(${f.img})`;
    s.innerHTML = `<div style="display:flex;flex-direction:column;align-items:flex-start;">
                    <div class="badge">${(f.genres || "").split(",")[0] || "Kids"}</div>
                    <div class="title">${escapeHtml(f.title)}</div>
                  </div>`;
    heroSlider.appendChild(s);
    s.onclick = ()=> openMovieModal(f);
  });

  clearInterval(window._heroInterval);
  if(heroSlider.children.length > 1){
    window._heroInterval = setInterval(()=>{ heroSlider.appendChild(heroSlider.children[0]); }, 4500);
  }
}

function renderSections(){
  content.innerHTML = "";

  let recommended = movies.filter(m=>m.featured);
  if(recommended.length === 0) recommended = movies.slice(0,6);
  if(filterKids) recommended = recommended.filter(m=>m.kids);
  if(filterGenre) recommended = recommended.filter(m=> (m.genres||"").split(",").includes(filterGenre));
  content.appendChild(makeRow("Recomendados", recommended));

  const genresList = Array.from(new Set(movies.flatMap(m=> (m.genres||"").split(",") ))).slice(0,6).filter(Boolean);
  genresList.forEach(g=>{
    let list = movies.filter(m => (m.genres||"").split(",").includes(g));
    if(filterKids) list = list.filter(m=>m.kids);
    if(filterGenre && filterGenre !== g) return;
    content.appendChild(makeRow(g, list));
  });

  let all = movies.slice();
  if(filterKids) all = all.filter(m=>m.kids);
  if(filterGenre) all = all.filter(m=> (m.genres||"").split(",").includes(filterGenre));
  content.appendChild(makeRow("Todos os Conteúdos", all));
}

function makeRow(title,list){
  const section = document.createElement("section");
  section.className = "section";

  const h = document.createElement("h2"); h.textContent = title;
  section.appendChild(h);

  const row = document.createElement("div"); row.className = "row";
  const controls = document.createElement("div"); controls.className = "controls";
  const left = document.createElement("button"); left.innerHTML = "◀"; const right = document.createElement("button"); right.innerHTML = "▶";
  controls.appendChild(left); controls.appendChild(right);
  row.appendChild(controls);

  const track = document.createElement("div"); track.className = "row-track";
  list.forEach(m=>{
    const c = document.createElement("div"); c.className = "card";
    const imgEl = document.createElement("img");
    imgEl.src = m.img;
    imgEl.alt = m.title;
    c.appendChild(imgEl);
    if(m.kids){
      const tag = document.createElement("div");
      tag.className = "tag"; tag.textContent = "INFANTIL";
      c.appendChild(tag);
    }
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = m.title;
    c.appendChild(meta);

    c.onclick = (e)=> openCardMenu(e,m);
    track.appendChild(c);
  });
  row.appendChild(track);
  section.appendChild(row);

  left.onclick = ()=> { track.scrollBy({left:-400, behavior:"smooth"}) }
  right.onclick = ()=> { track.scrollBy({left:400, behavior:"smooth"}) }

  let isDown=false, startX, scrollLeft;
  track.addEventListener('mousedown', (e)=>{
    isDown=true; track.classList.add('active'); startX=e.pageX - track.offsetLeft; scrollLeft=track.scrollLeft;
  });
  track.addEventListener('mouseleave', ()=> { isDown=false; track.classList.remove('active') });
  track.addEventListener('mouseup', ()=> { isDown=false; track.classList.remove('active') });
  track.addEventListener('mousemove', (e)=>{
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1;
    track.scrollLeft = scrollLeft - walk;
  });

  return section;
}

function openCardMenu(e, movie){
  e.stopPropagation();
  openMovieModal(movie);
}

function openMovieModal(movie=null){
  modal.classList.remove("hidden");
  if(movie){
    modalTitle.textContent = "Editar Conteúdo";
    inputId.value = movie.id;
    inputTitle.value = movie.title;
    inputGenres.value = movie.genres || "";
    inputImage.value = movie.img || "";
    inputIsKids.checked = !!movie.kids;
  } else {
    modalTitle.textContent = "Adicionar Conteúdo";
    movieForm.reset();
    inputId.value = "";
  }
}
function closeModal(){
  modal.classList.add("hidden");
  movieForm.reset();
}

async function handleMovieForm(e){
  e.preventDefault();
  const idVal = inputId.value;
  const title = inputTitle.value.trim();
  const genresVal = inputGenres.value.split(",").map(s=>s.trim()).filter(Boolean).join(",");
  const img = inputImage.value.trim() || `https://picsum.photos/seed/${encodeURIComponent(title)}/1200/675`;
  const kids = inputIsKids.checked;

  if(!title) return alert("Título é obrigatório");

  const payload = { title, genres:genresVal, img, kids, featured:false };

  if(idVal){
    await fetch(`${API_MOVIES}/${idVal}`, {
      method:"PUT",
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
  } else {
    await fetch(API_MOVIES, {
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
  }

  await loadMovies();
  buildChips();
  renderAll();
  closeModal();
}

async function deleteMovie(idToDelete){
  if(!confirm("Excluir conteúdo?")) return;
  await fetch(`${API_MOVIES}/${idToDelete}`, { method:"DELETE" });
  await loadMovies();
  buildChips();
  renderAll();
}

document.addEventListener("contextmenu", (ev)=>{
  if(ev.target.closest && ev.target.closest(".card")){
    ev.preventDefault();
    const cardEl = ev.target.closest(".card");
    const title = cardEl.querySelector(".meta")?.textContent || "";
    const movie = movies.find(m => m.title === title);
    if(!movie) return;
    const action = prompt(`${movie.title} — digite: editar | excluir | cancelar`);
    if(!action) return;
    if(action.toLowerCase().includes("editar")) openMovieModal(movie);
    if(action.toLowerCase().includes("excluir")) { deleteMovie(movie.id) }
  }
});

function buildChips(){
  genreChips.innerHTML = "";
  const allGenres = new Set();
  movies.forEach(m => (m.genres||"").split(",").forEach(g=> { if(g && g.trim()) allGenres.add(g.trim()) }));
  const genresArr = ["Todos", ...Array.from(allGenres)];
  genresArr.forEach(g => {
    const el = document.createElement("button");
    el.className = "chip";
    el.textContent = g;
    el.dataset.genre = g === "Todos" ? "" : g;
    el.onclick = () => {
      if(el.dataset.genre === "") filterGenre = null;
      else filterGenre = el.dataset.genre;
      document.querySelectorAll(".chip").forEach(c=>c.classList.remove("chip--active"));
      el.classList.add("chip--active");
      renderAll();
    };
    genreChips.appendChild(el);
    if(g === "Todos") el.classList.add("chip--active");
  });
}

async function loadGenrePage(){
  if(!document.getElementById("genre-list")) return;
  const list = document.getElementById("genre-list");
  list.innerHTML = "";
  genres.forEach(g=>{
    const li = document.createElement("li");
    li.textContent = g.name + " ";
    const btnDel = document.createElement("button");
    btnDel.textContent = "Excluir";
    btnDel.onclick = async ()=> {
      if(confirm("Excluir gênero?")) {
        await fetch(`${API_GENRES}/${g.id}`, { method:"DELETE" });
        await loadGenres();
        loadGenrePage();
        buildChips();
        await loadMovies();
        renderAll();
      }
    };
    li.appendChild(btnDel);
    list.appendChild(li);
  });

  const addBtn = document.getElementById("btn-add-genre");
  if(addBtn){
    addBtn.onclick = async () => {
      const input = document.getElementById("new-genre");
      const name = input.value.trim();
      if(!name) return alert("Digite um nome");
      const r = await fetch(API_GENRES, { method:"POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name })});
      if(r.status === 409) return alert("Gênero já existe");
      if(!r.ok) return alert("Erro ao criar");
      await loadGenres();
      input.value = "";
      loadGenrePage();
      buildChips();
    };
  }
}

async function loadAndRender(){
  await loadGenres();
  await loadMovies();
  buildChips();
  renderAll();
  renderUser();
  loadGenrePage();
}

loadAndRender();