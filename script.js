'use strict';

/* ---------- tiny helpers ---------- */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

/* ---------- footer year ---------- */
$('#year').textContent = new Date().getFullYear();

/* ---------- sticky header + back-to-top + scroll spy ---------- */
const header = $('#header');
const toTop = $('#toTop');
const navLinks = $$('.nav a');
const sections = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('sticky', y > 60);
  toTop.classList.toggle('show', y > 600);

  const pos = y + window.innerHeight / 3;
  let current = sections[0];
  sections.forEach((section) => {
    if (section.offsetTop <= pos) {
      current = section;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === '#' + current.id
    );
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- mobile nav ---------- */
const burger = $('#burger');
const nav = $('#nav');
const overlay = $('#overlay');

function toggleNav(open) {
  nav.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  overlay.classList.toggle('show', open);
}
burger.addEventListener('click', () => toggleNav(!nav.classList.contains('open')));
navLinks.forEach(a => a.addEventListener('click', () => toggleNav(false)));

/* ---------- info sidebar ---------- */
const sidebar = $('#sidebar');
function toggleSidebar(open) {
  sidebar.classList.toggle('open', open);
  overlay.classList.toggle('show', open);
}
$('#sidebarOpen').addEventListener('click', () => toggleSidebar(true));
$('#sidebarClose').addEventListener('click', () => toggleSidebar(false));
$$('.sidebar a').forEach(a => a.addEventListener('click', () => toggleSidebar(false)));
overlay.addEventListener('click', () => { toggleSidebar(false); toggleNav(false); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { toggleSidebar(false); toggleNav(false); }
});

/* ---------- hero slider ---------- */
const slides = $$('.slide');
const dotsBox = $('#dots');
let index = 0, timer;

slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
  b.addEventListener('click', () => { goTo(i); restart(); });
  dotsBox.appendChild(b);
});
const dots = $$('button', dotsBox);

function goTo(i) {
  index = (i + slides.length) % slides.length;
  slides.forEach((s, n) => s.classList.toggle('active', n === index));
  dots.forEach((d, n) => d.classList.toggle('active', n === index));
}
function restart() {
  clearInterval(timer);
  timer = setInterval(() => goTo(index + 1), 6000);
}

$('#next').addEventListener('click', () => { goTo(index + 1); restart(); });
$('#prev').addEventListener('click', () => { goTo(index - 1); restart(); });
$('#Home').addEventListener('mouseenter', () => clearInterval(timer));
$('#Home').addEventListener('mouseleave', restart);

// swipe support
let startX = 0;
$('#Home').addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
$('#Home').addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) { goTo(index + (dx < 0 ? 1 : -1)); restart(); }
});
goTo(0);
restart();

/* ---------- menu data + tabs ---------- */
// last item = Unsplash photo id used for the round thumbnail
const photo = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=240&h=240&q=70`;

const MENU = {
  breakfast: [
    ['Blueberry Pancakes', 'Fluffy pancakes with fresh blueberries and banana', 9.5, '1528207776546-365bb710ee93'],
    ['Berry Pancake Stack', 'Buttermilk pancakes layered with mixed berries', 10.5, '1612182062633-9ff3b3598e96'],
    ['Maple Pancakes', 'Golden pancakes with warm maple syrup', 8.5, '1565299543923-37dd37887442'],
    ['Blackberry Pancakes', 'Light pancakes topped with blackberries and cream', 10, '1575853121743-60c24f0a7502'],
    ['Classic Pancakes', 'Thick American-style pancakes with butter', 8, '1541288097308-7b8e3f58c4c6'],
    ['Blueberry Stack', 'Triple stack with blueberry compote and syrup', 11, '1620991565081-82743a5a499c']
  ],
  lunch: [
    ['Beef Burger & Fries', 'Aged beef, cheddar, pickles and house sauce', 15, '1457460866886-40ef8d4b42a0'],
    ['Grilled Meat Plate', 'Char-grilled meat served with seasonal vegetables', 16, '1568376794508-ae52c6ab3929'],
    ['Wood-Fired Pizza', 'Stone-baked pizza made fresh to order', 14.5, '1651981075280-9a9e01acbff0'],
    ['Appetizer Platter', 'Wings, chips, queso and salad to share', 17, '1600891964599-f61ba0e24092'],
    ['Chef\'s Lunch Plate', 'Daily special prepared by our kitchen', 13, '1564758564527-b97d79cb27c1'],
    ['Seasonal Plate', 'Fresh seasonal ingredients, lightly dressed', 12, '1651978595428-b79169f223a5']
  ],
  dinner: [
    ['Roasted Ribs', 'Slow-roasted ribs with tomatoes and potatoes', 26, '1544025162-d76694265947'],
    ['Steak & Asparagus', 'Grilled steak with asparagus and a glass of wine', 32, '1706650616334-97875fae8521'],
    ['Asian Trio', 'Three signature Asian-style dishes to share', 24, '1504674900247-0877df9cc836'],
    ['Lobster Tortellini', 'Handmade pasta filled with lobster in bisque', 20, '1652690772450-2cc9c53060f5'],
    ['Family Feast', 'A table spread for the whole family', 45, '1651440204296-a79fa9988007'],
    ['Chef\'s Dinner Plate', 'Tonight\'s special, ask your waiter', 22, '1657053460900-3a12f32b592f']
  ],
  drinks: [
    ['Fresh Fruit Juice', 'Pressed to order, no added sugar', 5, '1551024709-8f23befc6f87'],
    ['Pink Cocktail', 'Light, fruity and served ice cold', 9, '1605270012917-bf157c5a9541'],
    ['Orange Spritz', 'Sparkling orange aperitif over ice', 8.5, '1597403491447-3ab08f8e44dc'],
    ['Lemon Sour', 'Zesty lemon with a smooth finish', 9, '1598994392980-53a7fb033bcc'],
    ['RosÃ© Spritz', 'Chilled rosÃ© with a hint of berry', 8, '1583898350903-99fa829dad3d'],
    ['Old Fashioned', 'Classic whiskey cocktail, stirred slowly', 11, '1598994671512-395d7a6147e0']
  ]
};

const grid = $('#menuGrid');
const tabs = $$('.tab');

function renderMenu(key) {
  grid.innerHTML = '';
  MENU[key].forEach(([name, desc, price, img]) => {
    const el = document.createElement('div');
    el.className = 'menu-item';
    el.innerHTML =
      `<div class="menu-thumb" style="background-image:url('${photo(img)}')"></div>
       <div class="menu-info">
         <div class="menu-head"><h4>${name}</h4><span class="dots-line"></span><span class="amount">$${price.toFixed(2)}</span></div>
         <p>${desc}</p>
       </div>`;
    grid.appendChild(el);
  });
  // restart the fade animation
  grid.style.animation = 'none'; grid.offsetHeight; grid.style.animation = '';
}
function setTab(key) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === key));
  renderMenu(key);
}
tabs.forEach(t => t.addEventListener('click', () => setTab(t.dataset.tab)));
// "View menu" links on the offer cards pre-select a tab
$$('.link-btn[data-tab]').forEach(a => a.addEventListener('click', () => setTab(a.dataset.tab)));
setTab('breakfast');

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target); }
  });
}, { threshold: 0.15 });
$$('.reveal').forEach(el => io.observe(el));

/* ---------- booking form validation ---------- */
const form = $('#bookingForm');
const msg = $('#formMsg');
const dateInput = $('#date');
dateInput.min = new Date().toISOString().split('T')[0]; // no past dates

const rules = {
  name:   v => v.trim().length >= 3 || 'Please enter your full name',
  email:  v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address',
  phone:  v => /^[+\d][\d\s()-]{6,}$/.test(v.trim()) || 'Enter a valid phone number',
  guests: v => v !== '' || 'Select number of guests',
  date:   v => v !== '' || 'Choose a date',
  time:   v => {
    if (v === '') return 'Choose a time';
    return (v >= '08:00' && v <= '22:00') || 'We are open 8:00 am â€“ 10:00 pm';
  }
};

function check(input) {
  const result = rules[input.name](input.value);
  const field = input.closest('.field');
  field.classList.toggle('invalid', result !== true);
  $('.error', field).textContent = result === true ? '' : result;
  return result === true;
}
$$('input, select', form).forEach(i => {
  i.addEventListener('blur', () => check(i));
  i.addEventListener('input', () => { if (i.closest('.field').classList.contains('invalid')) check(i); });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const ok = $$('input, select', form).map(check).every(Boolean);
  msg.className = 'form-msg ' + (ok ? 'ok' : 'bad');
  if (ok) {
    msg.textContent = `Thank you ${$('#name').value.trim()}! Your table request for ${$('#date').value} at ${$('#time').value} has been received.`;
    form.reset();
  } else {
    msg.textContent = 'Please fix the highlighted fields.';
  }
});

/* ---------- footer contact form ---------- */
const cForm = $('#contactForm');
const cMsg = $('#contactMsg');
cForm.addEventListener('submit', e => {
  e.preventDefault();
  const n = $('#cname').value.trim(), m = $('#cemail').value.trim(), t = $('#cmsg').value.trim();
  const ok = n && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m) && t;
  cMsg.className = 'form-msg ' + (ok ? 'ok' : 'bad');
  cMsg.textContent = ok ? 'Message sent. We will get back to you soon!' : 'Please fill in all fields with a valid email.';
  if (ok) cForm.reset();
});