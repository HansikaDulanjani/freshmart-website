// This script handles the smooth navigation, mobile menu, and chatbot modal behavior.

// Select important elements from the page
const header = document.querySelector('.site-header');
const navMenu = document.querySelector('.nav-menu');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-menu a');
const chatButton = document.getElementById('chat-button');
const chatModal = document.getElementById('chat-modal');
const closeChat = document.getElementById('close-chat');
const chatIframe = document.getElementById('chat-iframe');
const chatFallback = document.getElementById('chat-fallback');
const chatUrl = 'https://faq-chatbot-jd5enis5lk8w43s6ssxj3p.streamlit.app?embed=true';

// ---------------------------
// Sticky header behavior
// ---------------------------
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ---------------------------
// Mobile menu toggle
// ---------------------------
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Close menu after clicking a nav link on mobile
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// ---------------------------
// Smooth scroll for in-page navigation links
// ---------------------------
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');

    if (!targetId || !targetId.startsWith('#')) return;

    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      event.preventDefault();
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ---------------------------
// Chat modal logic
// ---------------------------
let fallbackTimer = null;
let iframeLoaded = false;

function openChatModal() {
  chatModal.classList.add('open');
  chatModal.setAttribute('aria-hidden', 'false');

  // Load the iframe only when the user opens the modal
  chatIframe.src = chatUrl;

  // Show a fallback message only if the iframe is not loaded after a short delay
  chatFallback.hidden = true;
  iframeLoaded = false;

  clearTimeout(fallbackTimer);
  fallbackTimer = setTimeout(() => {
    if (!iframeLoaded) {
      chatFallback.hidden = false;
      chatFallback.textContent = 'Chat is opening in a new tab...';
      window.open('https://faq-chatbot-jd5enis5lk8w43s6ssxj3p.streamlit.app', '_blank');
    }
  }, 2500);
}

function closeChatModal() {
  chatModal.classList.remove('open');
  chatModal.setAttribute('aria-hidden', 'true');

  // Reset the iframe source to avoid keeping the app active when modal closes
  chatIframe.src = '';
  chatFallback.hidden = true;
  clearTimeout(fallbackTimer);
}

chatButton.addEventListener('click', openChatModal);
closeChat.addEventListener('click', closeChatModal);

chatModal.addEventListener('click', (event) => {
  if (event.target === chatModal) {
    closeChatModal();
  }
});

// Detect iframe load success
chatIframe.addEventListener('load', () => {
  iframeLoaded = true;
  chatFallback.hidden = true;
  clearTimeout(fallbackTimer);
});

// Add keyboard support for Escape to close modal
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && chatModal.classList.contains('open')) {
    closeChatModal();
  }
});

// Prevent form submission from reloading the page for the demo contact form
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Thank you! This is a demo form and does not send data yet.');
    contactForm.reset();
  });
}
