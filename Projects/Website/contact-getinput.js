// Get a reference to the form using its ID
const contactForm = document.getElementById('contactForm');

// Add an event listener for the 'submit' event
contactForm.addEventListener('submit', function(event) {
    // 1. Prevent the default form submission (stops page refresh)
    event.preventDefault();

    // 2. Get references to the input elements
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const phoneInput = document.getElementById('userPhone'); // Get phone input
    const messageInput = document.getElementById('userMessage');

    // 3. Get the values from the input elements
    const userName = nameInput.value.trim();
    const userEmail = emailInput.value.trim();
    const userPhone = phoneInput.value.trim(); // Get phone value
    const userMessage = messageInput.value.trim();

    // 4. (Optional) Basic Client-Side Validation
    // This is more robust than just 'required' attribute, and provides user feedback
    let isValid = true; // Flag to track overall form validity

    if (userName === '') {
        alert('Please enter your name');
        isValid = false;
        nameInput.focus();
        return; // Stop execution if validation fails
    }

    if (userEmail === '' || !userEmail.includes('@') || !userEmail.includes('.')) {
        alert('Please enter a valid email address');
        isValid = false;
        emailInput.focus();
        return;
    }

    // Basic phone validation (optional, can be more complex with regex for specific formats)
    // Only check if it's not empty; if it's empty, we allow it because it's not 'required' in HTML
    if (phoneInput.hasAttribute('required') && userPhone === '') {
        alert('Please enter your phone number');
        isValid = false;
        phoneInput.focus();
        return;
    }
    // You could add regex for number format here:
    // else if (userPhone !== '' && !/^\d{10}$/.test(userPhone)) { // Example for 10 digits
    //     alert('Please enter a valid 10-digit phone number.');
    //     isValid = false;
    //     phoneInput.focus();
    //     return;
    // }


    if (userMessage === '') {
        alert('Please enter your message');
        isValid = false;
        messageInput.focus();
        return;
    }

    // If all validations pass, isValid will still be true
    if (isValid) {
        console.log('Form data collected:');
        console.log('Name:', userName);
        console.log('Email:', userEmail);
        console.log('Phone:', userPhone); // Log the phone number
        console.log('Message:', userMessage);

        // --- 5. Send the data (Choose one of the methods below) ---
        // Option A: Send via Fetch API to a third-party service (e.g., Formspree, requiring you to get your endpoint from their site)
        // This is suitable if you want to handle the submission in JS and stay on the same page.
        /*
        const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORMSPREE_FORM_ID'; // <<< REPLACE THIS with your actual Formspree ID

        fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' // Essential for Formspree's JSON API
            },
            body: JSON.stringify({
                name: userName,
                email: userEmail,
                phone: userPhone, // Include phone
                message: userMessage
            })
        })
        .then(response => {
            if (response.ok) {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset(); // Clear the form fields
            } else {
                // Handle errors from the server
                return response.json().then(data => {
                    console.error('Form submission error:', data);
                    alert('Oops! Something went wrong: ' + (data.error || 'Please try again later.'));
                });
            }
        })
        .catch(error => {
            // Handle network or other fetch errors
            console.error('Network or other error:', error);
            alert('There was a problem sending your message. Please check your internet connection.');
        });
        */

        // Option B: Allow the HTML form's 'action' attribute to handle submission
        // This is simpler if you're using services like Formspree or FormSubmit that rely on the 'action' attribute.
        // In this case, you would REMOVE `event.preventDefault();` at the top of this function.
        // The validation logic would still run, and if isValid is false, the `return;` statements
        // would prevent the form from submitting. If isValid is true, the form would submit naturally.
        // Example <form action="https://formsubmit.co/your@email.com" method="POST">

        // For this example, if you don't implement a fetch() call, we'll just log and show an alert.
        alert('Form data collected and ready to be sent!'); // In a real app, you'd send it now.
        contactForm.reset(); // Clear the form fields
    }
});