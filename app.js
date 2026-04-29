// ============================================================
//  EQUILIBRIUM — Main App Logic
//  Handles: Auth, Tasks, Reflections, Community, Streaks
// ============================================================

// ─── State ───────────────────────────────────────────────────
let currentUser   = null;   // Supabase auth user object
let currentProfile = null;  // row from public.profiles
let tasks         = [];
let reflections   = [];
let posts         = [];
let anonMode      = false;
let selMoodLabel  = '';
let activePTab    = 'All';

const taskSugs = [
  'Read lecture notes','Complete problem set','Draft essay outline',
  'Review flashcards','Group project prep','Lab report',
  'Past papers','Email supervisor'
];

const nameSugs = [
  'quietlearner','rootedmind','steadygrowth','mossypath',
  'oakendesk','earlybloom','pagestone','fernfocus'
];

// ─── Real Success Stories ────────────────────────────────────
const stories = [
  {
    cat: 'Dropout → Tech Billionaire',
    emoji: '🍎',
    photo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=700&q=80',
    tag: 'Dropped out → Co-founded Apple',
    name: 'Steve Jobs',
    role: 'Co-founder of Apple Inc.',
    quote: "The minute I dropped out I could stop taking the required classes that didn't interest me, and begin dropping in on the ones that looked interesting.",
    fullStory: `Steve Jobs enrolled at Reed College in Oregon in 1972 but dropped out after just one semester because he felt guilty about the financial burden on his working-class adoptive parents. He didn't leave the campus though — he slept on the floor of friends' rooms, returned Coke bottles for food money, and secretly attended calligraphy classes that interested him. Those calligraphy classes, years later, directly influenced the beautiful typography of the original Mac. In 1976, aged 21, Jobs and Steve Wozniak founded Apple in a garage. He was ousted from the company he built in 1985 — a very public failure — but returned in 1997 to lead what became the most valuable company in history. "Getting fired from Apple was the best thing that could have ever happened to me," he said at his 2005 Stanford commencement speech.`,
    link: 'https://www.youtube.com/watch?v=UF8uR6Z6KLc',
    linkText: 'Watch his Stanford commencement speech →'
  },
  {
    cat: 'Dropout → Media Empire',
    emoji: '📺',
    photo: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=700&q=80',
    tag: 'College dropout → Richest self-made woman',
    name: 'Oprah Winfrey',
    role: 'Founder of Harpo Productions & OWN Network',
    quote: "The biggest adventure you can ever take is to live the life of your dreams.",
    fullStory: `Oprah grew up in poverty in rural Mississippi, raised largely by her grandmother. She won a full scholarship to Tennessee State University and began working in TV at 19. She was so talented that a local Baltimore station offered her a co-anchor job — but she had to drop out of college to take it, leaving just one credit shy of her degree. At 22 she moved to Chicago and took over a failing morning show called AM Chicago. Within months it was the highest-rated show in the city. The Oprah Winfrey Show launched nationally in 1986. She became the first Black female billionaire in history. In 2008, she finally received an honorary degree from Tennessee State — the school she'd dropped out of three decades earlier.`,
    link: 'https://www.biography.com/media-figure/oprah-winfrey',
    linkText: 'Read her full biography →'
  },
  {
    cat: 'Rejection → Publishing Legend',
    emoji: '⚡',
    photo: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&q=80',
    tag: 'Rejected 12 times → Sold 500 million books',
    name: 'J.K. Rowling',
    role: 'Author of the Harry Potter series',
    quote: "It is impossible to live without failing at something, unless you live so cautiously that you might as well not have lived at all.",
    fullStory: `In 1994, Joanne Rowling was a single mother living on welfare in Edinburgh, recently divorced, clinically depressed, and writing a children's book about a boy wizard in the margins of her life. She submitted the manuscript to 12 different literary agents. Every single one rejected it. The 13th, Christopher Little, took a chance. Publishers were sceptical — surely no child would read a book that long? Bloomsbury agreed to publish it with a print run of just 500 copies, and only after the chairman's 8-year-old daughter begged to read the rest after the first chapter. Harry Potter and the Philosopher's Stone was published in 1997. The series has now sold over 500 million copies worldwide and has been translated into 84 languages. Rowling is now a billionaire. She has spoken openly about how her failure and depression were what ultimately gave her the freedom to succeed — she had nothing left to lose.`,
    link: 'https://www.ted.com/talks/j_k_rowling_the_fringe_benefits_of_failure',
    linkText: 'Watch her Harvard commencement talk on failure →'
  },
  {
    cat: 'Failed Exams → Global Empire',
    emoji: '📦',
    photo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&q=80',
    tag: 'Failed exams twice → Built Alibaba',
    name: 'Jack Ma',
    role: 'Founder of Alibaba Group',
    quote: "Today is cruel. Tomorrow is crueller. And the day after tomorrow is beautiful.",
    fullStory: `Jack Ma failed his university entrance exams twice. He applied to 30 different jobs after graduating, including KFC — 24 people applied, 23 were hired, and he was the one rejected. He applied to Harvard 10 times. Rejected every time. When the internet arrived in China in the mid-1990s, Ma saw an opportunity. He had no technical background, no coding skills, and no funding. He gathered 18 friends in his apartment and convinced them to help him build a company. They worked for 13 months without salary. That company was Alibaba. Today it is one of the largest companies in the world, and at his peak Ma was the richest man in Asia. "I call myself a blind man riding on the back of a blind tiger," he once said. His story is a relentless case study in refusing to accept rejection as permanent.`,
    link: 'https://www.bbc.com/news/business-49470428',
    linkText: 'Read the BBC profile on Jack Ma →'
  },
  {
    cat: 'Dropout → Co-founded Twitter',
    emoji: '🐦',
    photo: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=700&q=80',
    tag: '"I felt like a failure" → Built Twitter & Square',
    name: 'Jack Dorsey',
    role: 'Co-founder of Twitter and Square',
    quote: "I felt like a failure in my mid-20s. I had dropped out of college twice and nothing was working.",
    fullStory: `Jack Dorsey dropped out of university not once but twice — first from Missouri University of Science and Technology, then from NYU just months before graduation. In a New Yorker interview he recalled feeling like a complete failure in his mid-20s, directionless and broke in New York City. He became obsessed with the idea of status updates — short messages about what people were doing, like a dispatch system for taxis. In 2006, he sent the first ever tweet: "just setting up my twttr." Twitter grew into one of the most influential platforms in history. Dorsey also founded Square, transforming how small businesses accept payments. He was ousted from Twitter (sound familiar?) and returned as CEO. His story is a direct echo of Jobs — doubted, dropped out, fired, returned, succeeded.`,
    link: 'https://www.newyorker.com/magazine/2013/10/14/it-takes-a-village-to-make-a-twitter',
    linkText: 'Read the full New Yorker profile →'
  }
];

const pathCats = ['All','Dropout → Tech Billionaire','Dropout → Media Empire','Rejection → Publishing Legend','Failed Exams → Global Empire','Dropout → Co-founded Twitter'];

// ─── AUTH ─────────────────────────────────────────────────────

// Check session on page load
window.addEventListener('load', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    await loadProfile();
  }

  // Listen for auth state changes (e.g. OAuth redirect returning)
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      currentUser = session.user;
      await loadProfile();
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      currentProfile = null;
      showScreen('s-login');
    }
  });
});

async function loadProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

  if (error || !data) {
    // Profile doesn't exist yet (shouldn't happen with trigger, but just in case)
    showScreen('s-username');
    return;
  }

  currentProfile = data;

  // If username is still the raw email prefix (default from trigger), ask them to choose
  if (!data.username || data.username === data.username.split('@')[0]) {
    // pre-fill the username input
    document.getElementById('uname-inp').value = data.username || '';
    populateNameSugs();
    showScreen('s-username');
  } else {
    await initApp();
  }
}

// Switch between Sign in / Create account tabs
function switchTab(tab) {
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('signup-extra').style.display = tab === 'signup' ? 'flex' : 'none';
  document.getElementById('auth-btn').textContent = tab === 'login' ? 'Sign in' : 'Create account';
  hideAuthError();
}

async function handleEmailAuth() {
  const email    = document.getElementById('l-email').value.trim();
  const password = document.getElementById('l-pass').value;
  const isSignup = document.getElementById('tab-signup').classList.contains('active');

  if (!email || !password) { showAuthError('Please enter your email and password.'); return; }

  if (isSignup) {
    const pass2 = document.getElementById('l-pass2').value;
    if (password !== pass2) { showAuthError('Passwords do not match.'); return; }
    if (password.length < 6) { showAuthError('Password must be at least 6 characters.'); return; }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { showAuthError(error.message); return; }
    showAuthError('Check your email for a confirmation link!', 'success');
  } else {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { showAuthError('Invalid email or password. Try again.'); return; }
  }
}

async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.href }
  });
  if (error) showAuthError(error.message);
}

async function signInWithMicrosoft() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: { redirectTo: window.location.href }
  });
  if (error) showAuthError(error.message);
}

async function logout() {
  await supabase.auth.signOut();
  tasks = []; reflections = []; posts = [];
  showScreen('s-login');
}

function showAuthError(msg, type = 'error') {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.style.display = 'block';
  el.style.background = type === 'success' ? 'var(--sage-xl)' : '#fde8e8';
  el.style.color = type === 'success' ? 'var(--moss)' : '#c0392b';
}
function hideAuthError() { document.getElementById('auth-error').style.display = 'none'; }

// ─── USERNAME SETUP ───────────────────────────────────────────

function populateNameSugs() {
  document.getElementById('u-sugs').innerHTML = nameSugs
    .map(s => `<button class="u-sug" onclick="document.getElementById('uname-inp').value='${s}'">${s}</button>`)
    .join('');
}

function pickAv(el, em) {
  document.querySelectorAll('.av-opt').forEach(e => e.classList.remove('sel'));
  el.classList.add('sel');
}

function getSelectedAvatar() {
  return document.querySelector('.av-opt.sel')?.textContent || '🌱';
}

async function saveProfile() {
  const username = document.getElementById('uname-inp').value.trim();
  const avatar   = getSelectedAvatar();

  if (!username) {
    document.getElementById('profile-error').textContent = 'Please choose a username.';
    document.getElementById('profile-error').style.display = 'block';
    return;
  }
  if (username.length < 3) {
    document.getElementById('profile-error').textContent = 'Username must be at least 3 characters.';
    document.getElementById('profile-error').style.display = 'block';
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .update({ username, avatar })
    .eq('id', currentUser.id);

  if (error) {
    document.getElementById('profile-error').textContent =
      error.code === '23505' ? 'That username is taken — try another.' : error.message;
    document.getElementById('profile-error').style.display = 'block';
    return;
  }

  currentProfile = { ...currentProfile, username, avatar };
  await initApp();
}

// ─── INIT APP ─────────────────────────────────────────────────

async function initApp() {
  showScreen('s-app');
  updateUIWithProfile();

  const now = new Date();
  document.getElementById('plan-date').textContent =
    now.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' });
  document.getElementById('pg-sub').textContent = 'Welcome back, ' + currentProfile.username;

  document.getElementById('task-sugs').innerHTML = taskSugs
    .map(s => `<button class="tsug" onclick="document.getElementById('tf-name').value='${s}'">${s}</button>`)
    .join('');

  // Load all data in parallel
  await Promise.all([
    loadTasks(),
    loadReflections(),
    loadPosts(),
    loadAndUpdateStreak()
  ]);

  renderDashPanels();
  renderPathTabs();
  renderStories();
}

function updateUIWithProfile() {
  const { username, avatar } = currentProfile;
  document.getElementById('hdr-av').textContent = avatar;
  document.getElementById('comp-av').textContent = avatar;
  document.getElementById('acc-av-big').textContent = avatar;
  document.getElementById('acc-av-row').textContent = avatar;
  document.getElementById('acc-uname').textContent = username;
  document.getElementById('acc-handle').textContent = '@' + username.toLowerCase().replace(/\s+/g,'_');
  document.getElementById('acc-email').textContent = currentUser.email;
  document.getElementById('acc-uname-row').textContent = username;
  document.getElementById('acc-email-row').textContent = currentUser.email;
}

// ─── TASKS ───────────────────────────────────────────────────

async function loadTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', currentProfile.id)
    .order('created_at', { ascending: false });

  if (!error) { tasks = data || []; renderTasks(); updateCounts(); }
}

function openTF()  { document.getElementById('tf').classList.add('open'); document.getElementById('tf-name').focus(); }
function closeTF() {
  document.getElementById('tf').classList.remove('open');
  document.getElementById('tf-name').value = '';
  document.getElementById('tf-dt').value = '';
  document.getElementById('tf-pri').value = 'me';
}

async function saveTask() {
  const text = document.getElementById('tf-name').value.trim();
  if (!text) return;

  const dtVal = document.getElementById('tf-dt').value;
  let due = '';
  if (dtVal) {
    const d = new Date(dtVal);
    due = d.toLocaleDateString('en-GB', { day:'numeric', month:'short' }) + ' ' +
          d.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
  }

  const priority = document.getElementById('tf-pri').value;

  const { data, error } = await supabase
    .from('tasks')
    .insert({ user_id: currentProfile.id, text, due, priority, done: false })
    .select()
    .single();

  if (!error) { tasks.unshift(data); closeTF(); renderTasks(); updateCounts(); }
}

async function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const { error } = await supabase
    .from('tasks')
    .update({ done: !task.done })
    .eq('id', id);

  if (!error) { task.done = !task.done; renderTasks(); updateCounts(); }
}

function renderTasks() {
  const pending = tasks.filter(t => !t.done);
  const done    = tasks.filter(t =>  t.done);
  let h = '';

  if (!tasks.length) {
    h = '<div class="no-tasks">No tasks yet — add one above</div>';
  }
  if (pending.length) { h += '<div class="task-sec-lbl">To do</div>';   pending.forEach(t => h += tHTML(t)); }
  if (done.length)    { h += '<div class="task-sec-lbl" style="margin-top:8px">Done</div>'; done.forEach(t => h += tHTML(t)); }

  document.getElementById('task-list').innerHTML = h;
}

function tHTML(t) {
  const pm = { hi:'phi', me:'pme', lo:'plo' };
  const pl = { hi:'High', me:'Med',  lo:'Low' };
  return `<div class="task-item" onclick="toggleTask(${t.id})">
    <div class="tck ${t.done ? 'done' : ''}">${t.done ? '✓' : ''}</div>
    <div style="flex:1">
      <div class="ttext ${t.done ? 'done' : ''}">${t.text}</div>
      <div class="tmeta">
        ${t.due ? `<span class="tdue">📅 ${t.due}</span>` : ''}
        <span class="tpri ${pm[t.priority] || 'pme'}">${pl[t.priority] || 'Med'}</span>
      </div>
    </div>
  </div>`;
}

// ─── REFLECTIONS ──────────────────────────────────────────────

async function loadReflections() {
  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .eq('user_id', currentProfile.id)
    .order('created_at', { ascending: false });

  if (!error) { reflections = data || []; renderRefs(); updateCounts(); }
}

function pickMood(el, mood, em) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
  selMoodLabel = em + ' ' + mood;
}

async function saveRef() {
  const text = document.getElementById('r-text').value.trim();
  if (!text) return;
  const mood = selMoodLabel || '😐 Okay';

  const { data, error } = await supabase
    .from('reflections')
    .insert({ user_id: currentProfile.id, mood, text })
    .select()
    .single();

  if (!error) {
    reflections.unshift(data);
    document.getElementById('r-text').value = '';
    selMoodLabel = '';
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('sel'));
    renderRefs(); updateCounts(); renderDashPanels();
  }
}

function renderRefs() {
  const empty = document.getElementById('r-empty');
  const list  = document.getElementById('ref-list');

  if (!reflections.length) { empty.style.display = 'block'; list.innerHTML = ''; return; }
  empty.style.display = 'none';
  list.innerHTML = reflections.map(r => {
    const d = new Date(r.created_at);
    const ds = d.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' }) +
               ' · ' + d.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
    return `<div class="ref-entry">
      <div class="ref-hdr"><span class="ref-date">${ds}</span><span>${r.mood}</span></div>
      <div class="ref-txt">${r.text}</div>
    </div>`;
  }).join('');
}

// ─── COMMUNITY ────────────────────────────────────────────────

async function loadPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profile:profiles!posts_user_id_fkey(username, avatar),
      replies(
        id, text, is_anon, created_at,
        profile:profiles!replies_user_id_fkey(username, avatar)
      )
    `)
    .order('created_at', { ascending: false });

  if (!error) { posts = data || []; renderFeed(); }
}

function toggleAnon() {
  anonMode = !anonMode;
  document.getElementById('anon-btn').classList.toggle('on', anonMode);
  document.getElementById('anon-dot').classList.toggle('on', anonMode);
  const av = document.getElementById('comp-av');
  av.textContent = anonMode ? '?' : currentProfile.avatar;
  av.style.opacity = anonMode ? '0.6' : '1';
}

async function addPost() {
  const text = document.getElementById('post-ta').value.trim();
  if (!text) return;

  const { error } = await supabase
    .from('posts')
    .insert({ user_id: currentProfile.id, text, is_anon: anonMode, likes: 0 });

  if (!error) {
    document.getElementById('post-ta').value = '';
    await loadPosts();
    renderDashPanels();
  }
}

async function toggleLike(postId) {
  // Check if already liked
  const { data: existing } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', currentProfile.id)
    .eq('post_id', postId)
    .maybeSingle();

  const post = posts.find(p => p.id === postId);
  if (!post) return;

  if (existing) {
    // Unlike
    await supabase.from('likes').delete()
      .eq('user_id', currentProfile.id).eq('post_id', postId);
    await supabase.from('posts').update({ likes: Math.max(0, post.likes - 1) }).eq('id', postId);
    post.likes = Math.max(0, post.likes - 1);
    post._liked = false;
  } else {
    // Like
    await supabase.from('likes').insert({ user_id: currentProfile.id, post_id: postId });
    await supabase.from('posts').update({ likes: post.likes + 1 }).eq('id', postId);
    post.likes = post.likes + 1;
    post._liked = true;
  }
  renderFeed();
}

function toggleReplyBox(postId) {
  const rb = document.getElementById('rb-' + postId);
  if (rb) { rb.classList.toggle('open'); }
}

async function sendReply(postId) {
  const inp = document.getElementById('ri-' + postId);
  const text = inp?.value.trim();
  if (!text) return;

  const { error } = await supabase
    .from('replies')
    .insert({ post_id: postId, user_id: currentProfile.id, text, is_anon: anonMode });

  if (!error) {
    inp.value = '';
    await loadPosts();
    setTimeout(() => {
      const rb = document.getElementById('rb-' + postId);
      if (rb) rb.classList.add('open');
    }, 100);
  }
}

function renderFeed() {
  const el = document.getElementById('feed');
  if (!posts.length) {
    el.innerHTML = '<div class="mini-empty" style="padding:20px;text-align:center;color:var(--tu)">No posts yet — be the first to share something!</div>';
    return;
  }

  el.innerHTML = posts.map(p => {
    const displayName = p.is_anon ? 'Anonymous' : (p.profile?.username || 'Student');
    const displayAv   = p.is_anon ? '?' : (p.profile?.avatar || '🌱');
    const avatarBg    = p.is_anon ? '#9B8873' : '#C4714A';
    const timeAgo     = formatTime(p.created_at);

    const repliesHTML = (p.replies || []).map(r => {
      const rName = r.is_anon ? 'Anonymous' : (r.profile?.username || 'Student');
      const rAv   = r.is_anon ? '?' : (r.profile?.avatar || '🌱');
      return `<div class="reply-item">
        <div class="reply-av">${rAv}</div>
        <div class="reply-bubble">
          <div class="reply-who">${rName}</div>
          <div class="reply-txt">${r.text}</div>
        </div>
      </div>`;
    }).join('');

    return `<div class="feed-post">
      <div class="fp-hdr">
        <div class="fp-av" style="background:${avatarBg}">${displayAv}</div>
        <div>
          <div class="fp-name">${displayName}${p.is_anon ? ' <span style="font-size:10px;font-weight:400;color:var(--tu)">(anonymous)</span>' : ''}</div>
          <div class="fp-meta">${timeAgo}</div>
        </div>
      </div>
      <div class="fp-body">${p.text}</div>
      <div class="fp-acts">
        <span class="fp-act ${p._liked ? 'liked' : ''}" onclick="toggleLike(${p.id})">♥ ${p.likes}</span>
        <span class="fp-act" onclick="toggleReplyBox(${p.id})">↩ Reply${p.replies?.length ? ` (${p.replies.length})` : ''}</span>
      </div>
      <div class="reply-area" id="rb-${p.id}">
        <div class="reply-list">${repliesHTML}</div>
        <div class="reply-composer">
          <input class="reply-inp" id="ri-${p.id}" placeholder="Write a reply..." onkeydown="if(event.key==='Enter')sendReply(${p.id})">
          <button class="reply-send" onclick="sendReply(${p.id})">Send</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ─── STREAK ───────────────────────────────────────────────────

async function loadAndUpdateStreak() {
  const today = new Date().toISOString().split('T')[0];

  let { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', currentProfile.id)
    .single();

  if (error || !data) {
    // Insert if missing
    await supabase.from('streaks').insert({ user_id: currentProfile.id, streak: 1, last_visit: today });
    data = { streak: 1, last_visit: today };
  } else {
    const last = new Date(data.last_visit);
    const now  = new Date(today);
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

    let newStreak = data.streak;
    if (diffDays === 1) {
      newStreak = data.streak + 1;  // consecutive day
    } else if (diffDays > 1) {
      newStreak = 1;                // broke the streak, reset to 1 for today
    }
    // diffDays === 0 means same day — don't change streak

    if (diffDays > 0) {
      await supabase.from('streaks')
        .update({ streak: newStreak, last_visit: today })
        .eq('user_id', currentProfile.id);
      data.streak = newStreak;
    }
  }

  renderStreak(data.streak);
}

function renderStreak(streak) {
  document.getElementById('streak-num').textContent  = streak;
  document.getElementById('streak-badge').textContent = streak + ' day streak';
  document.getElementById('streak-sub').textContent   = streak > 1 ? 'days in a row 🌿' : 'Start today 🌿';
  document.getElementById('a-streak').textContent     = streak;

  const days   = ['M','T','W','T','F','S','S'];
  const mapped = [1,2,3,4,5,6,0];
  const todayIdx = mapped.indexOf(new Date().getDay());

  let daysHTML = '', dowHTML = '';
  for (let i = 0; i < 7; i++) {
    const daysBack  = todayIdx - i;
    const isDone    = daysBack >= 0 && daysBack < streak && i !== todayIdx;
    const isToday   = i === todayIdx;
    const cls = isToday && streak > 0 ? 'sday today' : isDone ? 'sday done' : 'sday';
    daysHTML += `<div class="${cls}"></div>`;
    dowHTML  += `<span ${isToday ? 'class="cur"' : ''}>${days[i]}</span>`;
  }
  document.getElementById('streak-days').innerHTML = daysHTML;
  document.getElementById('streak-dow').innerHTML  = dowHTML;
}

// ─── PATHWAYS ─────────────────────────────────────────────────

function renderPathTabs() {
  document.getElementById('path-tabs').innerHTML = pathCats.map(c =>
    `<button class="ptab ${c === activePTab ? 'active' : ''}" onclick="filterPaths('${c}',this)">${c}</button>`
  ).join('');
}

function filterPaths(cat, el) {
  activePTab = cat;
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderStories();
}

function renderStories() {
  const filtered = activePTab === 'All' ? stories : stories.filter(s => s.cat === activePTab);
  document.getElementById('stories-list').innerHTML = filtered.map((s, i) => `
    <div class="story-card" id="sc-${i}">
      <img class="story-img" src="${s.photo}" alt="${s.name}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="story-fallback" style="background:#f0ebe4;display:none">${s.emoji}</div>
      <div class="story-body">
        <div class="story-tag-badge">${s.tag}</div>
        <div class="story-name">${s.name}</div>
        <div class="story-role">${s.role}</div>
        <div class="story-quote">"${s.quote}"</div>

        <!-- Expandable full story -->
        <div class="story-expand" id="sx-${i}" style="display:none">
          <div class="story-desc">${s.fullStory}</div>
        </div>

        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:10px">
          <button class="story-expand-btn" id="seb-${i}" onclick="toggleStory(${i})">Read full story ↓</button>
          <a class="story-link-btn" href="${s.link}" target="_blank" rel="noopener">${s.linkText}</a>
        </div>
      </div>
    </div>`).join('');
}

function toggleStory(i) {
  const panel = document.getElementById('sx-' + i);
  const btn   = document.getElementById('seb-' + i);
  const open  = panel.style.display === 'none';
  panel.style.display = open ? 'block' : 'none';
  btn.textContent     = open ? 'Collapse ↑' : 'Read full story ↓';
}

// ─── DASHBOARD PANELS ─────────────────────────────────────────

function renderDashPanels() {
  // Reflections
  const dr = document.getElementById('dash-refs');
  if (!reflections.length) {
    dr.innerHTML = '<div class="mini-empty">No reflections yet — start writing to see them here.</div>';
  } else {
    dr.innerHTML = reflections.slice(0, 2).map(r => `
      <div class="mini-ref-item">
        <div class="mini-ref-top">
          <span class="mini-ref-date">${formatTime(r.created_at)}</span>
          <span>${r.mood}</span>
        </div>
        <div class="mini-ref-txt">${r.text.length > 100 ? r.text.slice(0, 100) + '…' : r.text}</div>
      </div>`).join('');
  }

  // Community
  const dc = document.getElementById('dash-comm');
  if (!posts.length) {
    dc.innerHTML = '<div class="mini-empty">No posts yet.</div>';
  } else {
    dc.innerHTML = posts.slice(0, 3).map(p => {
      const name = p.is_anon ? 'Anonymous' : (p.profile?.username || 'Student');
      const av   = p.is_anon ? '?' : (p.profile?.avatar || '🌱');
      return `<div class="mini-post">
        <div class="mini-av" style="background:#C4714A">${av}</div>
        <div>
          <div class="mini-name">${name}</div>
          <div class="mini-text">${p.text.length > 80 ? p.text.slice(0, 80) + '…' : p.text}</div>
        </div>
      </div>`;
    }).join('');
  }

  // Stories
  document.getElementById('dash-stories').innerHTML = stories.slice(0, 3).map(s => `
    <div class="mini-story">
      <div class="mini-story-em">${s.emoji}</div>
      <div>
        <div class="mini-story-name">${s.name}</div>
        <div class="mini-story-tag">${s.tag}</div>
      </div>
    </div>`).join('');
}

// ─── ACCOUNT ─────────────────────────────────────────────────

function openEditProfile() {
  document.getElementById('edit-panel').style.display = 'block';
  document.getElementById('edit-uname').value = currentProfile.username;
  // Populate avatar grid
  const avatars = ['🌿','🪨','🌾','🌱','🍂','☀️','🦋','🌙'];
  document.getElementById('acc-av-grid').innerHTML = avatars.map(a =>
    `<div class="av-opt ${a === currentProfile.avatar ? 'sel' : ''}" onclick="pickAccAv(this,'${a}')">${a}</div>`
  ).join('');
}

function pickAccAv(el, em) {
  document.querySelectorAll('#acc-av-grid .av-opt').forEach(e => e.classList.remove('sel'));
  el.classList.add('sel');
}

function closeEditProfile() {
  document.getElementById('edit-panel').style.display = 'none';
  document.getElementById('edit-error').style.display = 'none';
}

async function saveEditProfile() {
  const username = document.getElementById('edit-uname').value.trim();
  const avatar   = document.querySelector('#acc-av-grid .av-opt.sel')?.textContent || currentProfile.avatar;

  if (!username || username.length < 3) {
    document.getElementById('edit-error').textContent = 'Username must be at least 3 characters.';
    document.getElementById('edit-error').style.display = 'block';
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .update({ username, avatar })
    .eq('id', currentProfile.id);

  if (error) {
    document.getElementById('edit-error').textContent =
      error.code === '23505' ? 'That username is taken.' : error.message;
    document.getElementById('edit-error').style.display = 'block';
    return;
  }

  currentProfile = { ...currentProfile, username, avatar };
  updateUIWithProfile();
  closeEditProfile();
}

// ─── HELPERS ──────────────────────────────────────────────────

function updateCounts() {
  const done = tasks.filter(t => t.done).length;
  document.getElementById('done-count').textContent = done;
  document.getElementById('ref-count').textContent  = reflections.length;
  document.getElementById('a-tasks').textContent    = done;
  document.getElementById('a-refs').textContent     = reflections.length;
}

function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nv').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (el) el.classList.add('active');

  const titles = { dashboard:'Dashboard', reflect:'Daily Reflection', community:'Community', pathways:'Pathways & Stories', account:'My Account' };
  const subs   = { dashboard:'Welcome back, '+currentProfile?.username, reflect:'Take a moment for yourself', community:'Your academic circle', pathways:'Real stories, real paths', account:'Your profile & settings' };
  document.getElementById('pg-title').textContent = titles[id] || id;
  document.getElementById('pg-sub').textContent   = subs[id]   || '';
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function formatTime(ts) {
  if (!ts) return '';
  const d    = new Date(ts);
  const now  = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'short' });
}
