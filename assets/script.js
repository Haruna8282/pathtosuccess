document.getElementById('year').textContent = new Date().getFullYear();

  // ---- Mobile nav ----
  const burger = document.getElementById('burgerBtn');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  // ---- Contact form (front-end only demo) ----
  function handleContact(e){
    e.preventDefault();
    const msg = document.getElementById('contactMsg');
    msg.classList.add('show');
    e.target.reset();
    setTimeout(()=>msg.classList.remove('show'), 6000);
  }

  // ---- Portal logic ----
  let currentRole = 'student';
  let currentTab = 'signin';

  function openPortal(role, tab){
    setRole(role);
    setTab(tab);
    document.getElementById('portalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closePortal(){
    document.getElementById('portalOverlay').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('portalMsg').classList.remove('show');
  }
  document.getElementById('portalOverlay').addEventListener('click', (e) => {
    if(e.target.id === 'portalOverlay') closePortal();
  });

  function setRole(role){
    currentRole = role;
    document.getElementById('roleStudentBtn').classList.toggle('active', role==='student');
    document.getElementById('roleStaffBtn').classList.toggle('active', role==='staff');
    document.getElementById('portalTitle').textContent = role === 'student' ? 'Student Portal' : 'Staff Portal';
    document.getElementById('signupIdLabel').textContent = role === 'student' ? 'Class (e.g. JSS1, SS2)' : 'Staff ID / Department';
  }

  function setTab(tab){
    currentTab = tab;
    document.getElementById('tabSignin').classList.toggle('active', tab==='signin');
    document.getElementById('tabSignup').classList.toggle('active', tab==='signup');
    document.getElementById('signinForm').classList.toggle('active', tab==='signin');
    document.getElementById('signupForm').classList.toggle('active', tab==='signup');
    document.getElementById('portalMsg').classList.remove('show');
  }

  function showPortalMsg(text, ok){
    const msg = document.getElementById('portalMsg');
    msg.textContent = text;
    msg.classList.remove('ok','err');
    msg.classList.add(ok ? 'ok' : 'err', 'show');
  }

  function storageKey(){ return 'psia_users_' + currentRole; }

  function getUsers(){
    try{ return JSON.parse(localStorage.getItem(storageKey())) || {}; }
    catch(e){ return {}; }
  }
  function saveUsers(users){
    localStorage.setItem(storageKey(), JSON.stringify(users));
  }

  function handleSignup(e){
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const idField = document.getElementById('signupIdField').value.trim();
    const pass = document.getElementById('signupPass').value;

    const users = getUsers();
    if(users[email]){
      showPortalMsg('An account with this email already exists. Please sign in.', false);
      return;
    }
    users[email] = { name, idField, pass };
    saveUsers(users);
    showPortalMsg('Account created successfully! You can now sign in.', true);
    e.target.reset();
    setTimeout(()=>setTab('signin'), 1200);
  }

  function handleSignin(e){
    e.preventDefault();
    const id = document.getElementById('signinId').value.trim();
    const pass = document.getElementById('signinPass').value;
    const users = getUsers();

    const match = Object.entries(users).find(([email,u]) => (email === id || u.idField === id) && u.pass === pass);
    if(match){
      showPortalMsg('Welcome back, ' + match[1].name + '! Sign-in successful.', true);
      setTimeout(closePortal, 1400);
    } else {
      showPortalMsg('We could not find a matching account. Please sign up first.', false);
    }
  }
