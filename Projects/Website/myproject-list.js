// "My Projects" Button script goes here

const viewProjectsButton = document.getElementById('viewmyprojects');

        // Add an event listener to the button
        viewProjectsButton.addEventListener('click', function() {
            const targetURL = 'project-list.html';

            // Navigate to the specified URL
            //window.location.href = targetURL;

            window.open(targetURL, '_blank');
        });
