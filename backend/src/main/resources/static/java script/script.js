const LS_KEY = "ks_movies_v1";
const LS_USER = "ks_user_v1";

const sampleData = [
  { id: id(), title: "Encanto", genres: ["Animação","Família"], img: "https://picsum.photos/seed/encanto/1200/675", kids: true, featured:true },
  { id: id(), title: "Toy Story", genres: ["Animação","Família"], img: "https://picsum.photos/seed/toystory/1200/675", kids:true, featured:true },
  { id: id(), title: "Luca", genres: ["Animação","Aventura"], img: "https://picsum.photos/seed/luca/1200/675", kids:true },
  { id: id(), title: "Planeta Azul", genres:["Documentário","Natureza"], img:"https://picsum.photos/seed/nature/1200/675", kids:true },
  { id: id(), title: "Aventura no Espaço", genres:["Aventura","Ficção"], img:"https://picsum.photos/seed/space/1200/675", kids:false },
  { id: id(), title: "Piratas", genres:["Aventura","Ação"], img:"https://picsum.photos/seed/pirata/1200/675", kids:false }
];

function id(){ return Math.random().toString(36).slice(2,9) }
function saveMovies(arr){ localStorage.setItem(LS_KEY, JSON.stringify(arr)) }
function loadMovies(){
  const raw = localStorage.getItem(LS_KEY);
  if(!raw){ saveMovies(sampleData); return sampleData.slice() }
  try { return JSON.parse(raw) } catch(e){ saveMovies(sampleData); return sampleData.slice() }
}

let movies = loadMovies();
let filterGenre = null;
let filterKids = false;

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

renderAll();
buildChips();
attachEvents();
renderHero();


function buildChips(){
  const allGenres = new Set();
  movies.forEach(m => m.genres.forEach(g => allGenres.add(g.trim())));
  genreChips.innerHTML = "";
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
  resetBtn.onclick = ()=> { if(confirm("Resetar dados para o exemplo?")) { localStorage.removeItem(LS_KEY); movies = loadMovies(); renderAll(); buildChips(); renderHero(); } }

  // modal close on backdrop click
  document.querySelectorAll(".ks-modal").forEach(m=>{
    m.addEventListener("click", (e)=> { if(e.target === m) m.classList.add("hidden") })
  });
}

function handleUserForm(e){
  e.preventDefault();
  const name = userName.value.trim();
  const email = userEmail.value.trim();
  if(!name || !email) return alert("Preencha nome e e-mail");
  const user = { name, email, created: Date.now() };
  localStorage.setItem(LS_USER, JSON.stringify(user));
  renderUser();
  modalUser.classList.add("hidden");
  userForm.reset();
}

function renderUser(){
  const raw = localStorage.getItem(LS_USER);
  if(!raw) { userBadge.hidden = true; return }
  const u = JSON.parse(raw);
  userInitials.textContent = u.name.split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase();
  userBadge.hidden = false;
}

/* Renderização principal */
function renderAll(){
  renderHero();
  renderSections();
  renderUser();
}

function renderHero(){
  heroSlider.innerHTML = "";
  const featured = movies.filter(m=>m.featured).slice(0,4);
  const pool = featured.length ? featured : movies.slice(0,3);
  // main big slide + side mini slides
  pool.forEach((f, i)=>{
    const s = document.createElement("div");
    s.className = i === 0 ? "slide" : "slide small";
    s.style.backgroundImage = `url(${f.img})`;
    s.innerHTML = `<div style="display:flex;flex-direction:column;align-items:flex-start;">
                     <div class="badge">${f.genres[0] || "Kids"}</div>
                     <div class="title">${escapeHtml(f.title)}</div>
                   </div>`;
    heroSlider.appendChild(s);
    s.onclick = ()=> openMovieModal(f);
  });

  // autoplay (simple)
  clearInterval(window._heroInterval);
  let idx = 0;
  const slides = heroSlider.querySelectorAll(".slide");
  if(slides.length > 1){
    window._heroInterval = setInterval(()=>{
      // rotate nodes visually: move first to end
      heroSlider.appendChild(heroSlider.children[0]);
    }, 4500);
  }
}

/* Agrupa por seções */
function renderSections(){
  content.innerHTML = "";

  // "Recomendados"
  let recommended = movies.filter(m=>m.featured);
  if(recommended.length === 0) recommended = movies.slice(0,6);
  if(filterKids) recommended = recommended.filter(m=>m.kids);
  if(filterGenre) recommended = recommended.filter(m=>m.genres.includes(filterGenre));
  content.appendChild(makeRow("Recomendados", recommended));

  // seção por gênero
  const genres = Array.from(new Set(movies.flatMap(m=>m.genres))).slice(0,6);
  genres.forEach(g=>{
    let list = movies.filter(m => m.genres.includes(g));
    if(filterKids) list = list.filter(m=>m.kids);
    if(filterGenre && filterGenre!==g) return;
    content.appendChild(makeRow(g, list));
  });

  // "Todos"
  let all = movies.slice();
  if(filterKids) all = all.filter(m=>m.kids);
  if(filterGenre) all = all.filter(m=>m.genres.includes(filterGenre));
  content.appendChild(makeRow("Todos os Conteúdos", all));
}

/* Monta uma linha (row) com controles */
function makeRow(title, list){
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
    if(m.kids) c.innerHTML += `<div class="tag">INFANTIL</div>`;
    c.innerHTML += `<div class="meta">${escapeHtml(m.title)}</div>`;
    // click abre modal editar
    c.onclick = (e)=> openCardMenu(e,m);
    track.appendChild(c);
  });
  row.appendChild(track);
  section.appendChild(row);

  // controls scroll
  left.onclick = ()=> { track.scrollBy({left:-400, behavior:"smooth"}) }
  right.onclick = ()=> { track.scrollBy({left:400, behavior:"smooth"}) }

  // drag to scroll
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

/* abrir modal edição */
function openCardMenu(e, movie){
  e.stopPropagation();
  openMovieModal(movie);
}

/* modal open/close e formulário */
function openMovieModal(movie=null){
  modal.classList.remove("hidden");
  if(movie){
    modalTitle.textContent = "Editar Conteúdo";
    inputId.value = movie.id;
    inputTitle.value = movie.title;
    inputGenres.value = movie.genres.join(", ");
    inputImage.value = movie.img;
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

/* salvar/editar */
function handleMovieForm(e){
  e.preventDefault();
  const idVal = inputId.value;
  const title = inputTitle.value.trim();
  const genres = inputGenres.value.split(",").map(s=>s.trim()).filter(Boolean);
  const img = inputImage.value.trim() || `https://picsum.photos/seed/${encodeURIComponent(title)}/1200/675`;
  const kids = inputIsKids.checked;

  if(!title) return alert("Título é obrigatório");

  if(idVal){
    // editar
    movies = movies.map(m => m.id === idVal ? {...m, title, genres, img, kids} : m);
  } else {
    // novo
    const newMovie = { id: id(), title, genres, img, kids, featured:false };
    movies.unshift(newMovie);
  }
  saveMovies(movies);
  buildChips();
  renderAll();
  closeModal();
}

/* excluir */
function deleteMovie(idToDelete){
  if(!confirm("Excluir conteúdo?")) return;
  movies = movies.filter(m=>m.id !== idToDelete);
  saveMovies(movies);
  buildChips();
  renderAll();
}

/* menu via clique com botão direito (simples) */
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

/* inicializar usuário (se existir) */
renderUser();

/* util: escape HTML para segurança */
function escapeHtml(str){
  if(!str) return "";
  return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
