// Get a reference to the form using its ID
const contactForm = document.getElementById('contactForm');

// Get references to UI feedback elements
// IMPORTANT: These elements must exist in your HTML with these IDs:
const formMessage = document.getElementById('form-message');
const submitButton = document.getElementById('submitButton');
const loadingSpinner = document.getElementById('loadingSpinner');

// IMPORTANT: This API_GATEWAY_URL must be replaced with your actual API Gateway Invoke URL.
const API_GATEWAY_URL = 'https://9jrcfloh2g.execute-api.us-east-1.amazonaws.com/prod/submit';

/**s
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
        console.warn('HTML element with ID "form-message" not found. Message displayed via alert.');
        alert(message); // Fallback to alert if form-message element is missing
    }
}

// Add an event listener for the 'submit' event to the contact form
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
        nameInput.focus();
    } else if (userEmail === '' || !userEmail.includes('@') || !userEmail.includes('.')) {
        displayMessage('Please enter a valid email address.', 'error');
        isValid = false;
        emailInput.focus();
    }
    // The phone number input does NOT have the 'required' attribute in your HTML,
    // so this specific validation for 'required' will not trigger unless you add 'required'
    // to the userPhone input in HTML: <input type="tel" id="userPhone" name="userPhone" required>
    else if (phoneInput && phoneInput.hasAttribute('required') && userPhone === '') {
        displayMessage('Please enter your phone number.', 'error');
        isValid = false;
        phoneInput.focus();
    }
    else if (userMessage === '') {
        displayMessage('Please enter your message.', 'error');
        isValid = false;
        messageInput.focus();
    }

    // If any validation failed, stop the submission process here
    if (!isValid) {
        if (submitButton) submitButton.disabled = false;
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        return;
    }

    // 6. Prepare the data payload for sending to API Gateway
    const formData = {
        name: userName,
        email: userEmail,
        phone: userPhone,
        message: userMessage
    };

    // 7. Send the data to API Gateway using the Fetch API
    try {
        const response = await fetch(API_GATEWAY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // 8. Handle the response from API Gateway
        if (response.ok) {
            displayMessage('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset(); // Clear all form fields after successful submission
        } else {
            let errorDetails = 'An unexpected error occurred. Please try again.';
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorDetails = errorData.message;
                }
                console.error('API Gateway Error Details:', errorData);
            } catch (parseError) {
                console.warn('Could not parse error response as JSON:', parseError);
                errorDetails = `Server responded with status: ${response.status} ${response.statusText}`;
            }
            console.error('API Gateway Error Status:', response.status, response.statusText);
            displayMessage(`Failed to send message: ${errorDetails}`, 'error');
        }
    } catch (error) {
        console.error('Network or Fetch API Error:', error);
        displayMessage('Could not send message. Please check your internet connection or try again later.', 'error');
    } finally {
        // This finally block always executes, regardless of success or failure, to reset UI state
        if (submitButton) submitButton.disabled = false;
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
});
