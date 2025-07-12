// "Get Resume" Button action script goes here

const getResumeButton = document.getElementById('downloadresume');
                    const resumePdfUrl = '../Website/Resumes/Raseef_CV_completed.pdf';
                    const suggestedResumeFileName = 'Downloaded_Raseef_Resume.pdf'; 
            
                    if (getResumeButton) {
                        getResumeButton.addEventListener('click', function() {
                            const link = document.createElement('a');
                            link.href = resumePdfUrl;
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            console.log('Resume opened in new tab:', resumePdfUrl);
                        });
                    } else {
                        console.error('Error: Button with ID "downloadresume" not found. Check your HTML ID.');
                    }



