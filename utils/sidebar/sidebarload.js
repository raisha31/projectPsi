document.addEventListener("DOMContentLoaded", function() {
    // Fetch the sidebar HTML
    fetch('utils/sidebar/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebarContainer').innerHTML = data;

            // Function to set the active class based on data-id
            function setActiveNavItem(activeItemId) {
                var navItems = document.querySelectorAll('.nav-item');
                navItems.forEach(function(item) {
                    item.classList.remove('active');
                    if (item.getAttribute('data-id') === activeItemId) {
                        item.classList.add('active');
                    }
                });
            }

            // Get the active item from localStorage
            var activeItem = localStorage.getItem('activeNavItem');
            if (activeItem) {
                setActiveNavItem(activeItem);
            }

            // Add click event listeners to update the active state
            var navLinks = document.querySelectorAll('.nav-item a');
            navLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    var activeId = this.parentElement.getAttribute('data-id');
                    localStorage.setItem('activeNavItem', activeId);
                    setActiveNavItem(activeId);
                });
            });
        });
});
