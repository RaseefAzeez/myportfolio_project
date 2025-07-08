// Get a reference to the form using its ID
const contactForm = document.getElementById('contactForm');

// Get references to UI feedback elements
// IMPORTANT: Ensure these elements exist in your HTML with these IDs:
// <div id="form-message"></div>
// <button type="submit" id="submitButton">Send Message</button>
// <div id="loadingSpinner" style="display: none;"></div> (add basic CSS for spinner animation)
const formMessage = document.getElementById('form-message');
const submitButton = document.getElementById('submitButton');
const loadingSpinner = document.getElementById('loadingSpinner');


// IMPORTANT: This API_GATEWAY_URL must be replaced with your actual API Gateway Invoke URL.
// Example: 'https://xxxxxxxx.execute-api.your-region.amazonaws.com/prod/submit'
// During local development, you can hardcode it.
// For production, your CI/CD pipeline (e.g., GitHub Actions) should inject the correct URL
// by replacing this placeholder.
const API_GATEWAY_URL = 'https://8o1uqi2tkb.execute-api.us-east-1.amazonaws.com/prod'; // <<< REPLACE THIS WITH YOUR ACTUAL API GATEWAY URL

/**
 * Helper function to display messages to the user.
 * It checks if the formMessage element exists before attempting to update it.
 * @param {string} message - The message text to display.
 * @param {string} type - 'success' or 'error' to apply appropriate styling classes.
 */
function displayMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = type; // Adds 'success' or 'error' class for styling
        formMessage.style.display = 'block'; // Make the message visible
    } else {
        // Fallback if form-message element is not found, useful for debugging
        console.warn('HTML element with ID "form-message" not found. Message displayed via alert.');
        alert(message);
    }
}

// Add an event listener for the 'submit' event to the contact form
// The 'async' keyword is crucial here because we will use 'await' inside.
contactForm.addEventListener('submit', async function(event) {
    // 1. Prevent the default form submission (stops the page from refreshing)
    event.preventDefault();

    // 2. Initial UI state changes: Disable button, show spinner, hide previous messages
    if (formMessage) {
        formMessage.style.display = 'none'; // Hide any previous messages
        formMessage.className = ''; // Clear any previous success/error classes
    }
    if (submitButton) {
        submitButton.disabled = true; // Disable the submit button to prevent multiple submissions
    }
    if (loadingSpinner) {
        loadingSpinner.style.display = 'block'; // Show the loading spinner
    }

    // 3. Get references to the input elements using their IDs
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const phoneInput = document.getElementById('userPhone');
    const messageInput = document.getElementById('userMessage');

    // 4. Get the values from the input elements, trimming leading/trailing whitespace
    const userName = nameInput.value.trim();
    const userEmail = emailInput.value.trim();
    const userPhone = phoneInput.value.trim();
    const userMessage = messageInput.value.trim();

    // 5. Client-Side Validation: Provide immediate feedback to the user
    let isValid = true; // Flag to track overall form validity

    if (userName === '') {
        displayMessage('Please enter your name.', 'error');
        isValid = false;
        nameInput.focus(); // Focus on the problematic input field
    } else if (userEmail === '' || !userEmail.includes('@') || !userEmail.includes('.')) {
        displayMessage('Please enter a valid email address.', 'error');
        isValid = false;
        emailInput.focus();
    }
    // Check if phone input exists and is required, then validate if empty
    else if (phoneInput && phoneInput.hasAttribute('required') && userPhone === '') {
        displayMessage('Please enter your phone number.', 'error');
        isValid = false;
        phoneInput.focus();
    }
    // Example: Add more complex phone number validation using regex if needed
    // else if (userPhone !== '' && !/^\d{10}$/.test(userPhone)) { // Example for 10 digits
    //     displayMessage('Please enter a valid 10-digit phone number.', 'error');
    //     isValid = false;
    //     phoneInput.focus();
    // }
    else if (userMessage === '') { // Ensure the message field is also filled
        displayMessage('Please enter your message.', 'error');
        isValid = false;
        messageInput.focus();
    }

    // If any validation failed, stop the submission process here
    if (!isValid) {
        if (submitButton) submitButton.disabled = false; // Re-enable button
        if (loadingSpinner) loadingSpinner.style.display = 'none'; // Hide spinner
        return; // Exit the function
    }

    // 6. Prepare the data payload for sending to API Gateway
    // The keys here (name, email, phone, message) should match what your Lambda function expects.
    const formData = {
        name: userName,
        email: userEmail,
        phone: userPhone, // Send phone even if empty; Lambda can handle it as optional
        message: userMessage
    };

    // 7. Send the data to API Gateway using the Fetch API
    try {
        const response = await fetch(API_GATEWAY_URL, {
            method: 'POST', // Use POST method for submitting form data
            headers: {
                'Content-Type': 'application/json', // Inform the server that we are sending JSON
                'Accept': 'application/json' // Inform the server that we prefer JSON back
            },
            body: JSON.stringify(formData) // Convert the JavaScript object to a JSON string
        });

        // 8. Handle the response from API Gateway
        if (response.ok) { // 'response.ok' is true for HTTP status codes 200-299 (success)
            // const result = await response.json(); // You can parse the response body if your API returns data on success
            displayMessage('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset(); // Clear all form fields after successful submission
        } else {
            // If the response is not OK (e.g., 4xx or 5xx error from API Gateway/Lambda)
            const errorData = await response.json(); // Attempt to parse the error message from the API response
            console.error('API Gateway Error:', errorData); // Log the detailed error object to the console for debugging
            displayMessage(`Failed to send message: ${errorData.message || 'An unexpected error occurred. Please try again.'}`, 'error');
        }
    } catch (error) {
        // This 'catch' block handles network errors (e.g., no internet, CORS issues, unreachable API)
        console.error('Network or Fetch API Error:', error); // Log the actual error object
        displayMessage('Could not send message. Please check your internet connection or try again later.', 'error');
    } finally {
        // This 'finally' block always executes, regardless of success or failure, to reset UI state
        if (submitButton) submitButton.disabled = false; // Re-enable the submit button
        if (loadingSpinner) loadingSpinner.style.display = 'none'; // Hide the loading spinner
    }
});