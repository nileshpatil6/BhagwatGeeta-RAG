// Common Navbar Implementation

document.addEventListener('DOMContentLoaded', function() {
  // Define the navbar structure
  const navbarHTML = `
    <nav class="navigation">
      <a href="https://home.sakha.chat" class="nav-item" id="nav-home">
        <i class="fas fa-home"></i>
        <span>Home</span>
      </a>
      <a href="https://vedic.sakha.chat" class="nav-item" id="nav-books">
        <i class="fas fa-book"></i>
        <span>Books</span>
      </a>
      <a href="https://home.sakha.chat/chant.html" class="nav-item" id="nav-chanting">
        <i class="fas fa-om"></i>
        <span>Chanting</span>
      </a>
      <a href="https://gita.sakha.chat" class="nav-item" id="nav-remedies">
        <i class="fas fa-leaf"></i>
        <span>Remedies</span>
      </a>
      <a href="https://home.sakha.chat/our-team.html" class="nav-item" id="nav-team">
        <i class="fas fa-users"></i>
        <span>Our Team</span>
      </a>
    </nav>
  `;

  // Insert the navbar into the page
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = navbarHTML;
  } else {
    // If no container exists, append to body
    document.body.insertAdjacentHTML('beforeend', navbarHTML);
  }

  // Set active state based on current page
  setActiveNavItem();

  // Function to set the active navigation item based on the current URL
  function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const currentHost = window.location.host;
    
    // Remove any existing active classes
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('nav-active');
    });
    
    // Set active class based on current URL
    if (currentHost.includes('home.sakha.chat') && !currentPath.includes('chant') && !currentPath.includes('our-team')) {
      document.getElementById('nav-home').classList.add('nav-active');
    } else if (currentHost.includes('vedic.sakha.chat')) {
      document.getElementById('nav-books').classList.add('nav-active');
    } else if (currentPath.includes('chant') || currentPath.includes('mala')) {
      document.getElementById('nav-chanting').classList.add('nav-active');
    } else if (currentHost.includes('gita.sakha.chat')) {
      document.getElementById('nav-remedies').classList.add('nav-active');
    } else if (currentPath.includes('our-team')) {
      document.getElementById('nav-team').classList.add('nav-active');
    }
  }

  // Handle dark mode if it exists in the page
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
      const navigation = document.querySelector('.navigation');
      const navItems = document.querySelectorAll('.nav-item');
      const isDarkMode = document.body.classList.contains('dark-mode');
      
      if (isDarkMode) {
        navigation.style.backgroundColor = 'rgba(30, 30, 30, 0.9)';
        navItems.forEach(item => {
          if (!item.classList.contains('nav-active')) {
            item.style.color = '#f0f0f0';
          }
        });
      } else {
        navigation.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        navItems.forEach(item => {
          if (!item.classList.contains('nav-active')) {
            item.style.color = 'var(--text-color)';
          }
        });
      }
    });
  }
});
