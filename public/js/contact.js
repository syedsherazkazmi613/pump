document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const projectDescription = document.getElementById('projectDescription');
    const calendlySection = document.getElementById('calendlySection');
    const descriptionField = document.getElementById('description');

    // Handle radio button changes
    document.querySelectorAll('input[name="contactType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'other') {
                projectDescription.classList.remove('hidden');
                calendlySection.classList.add('hidden');
                descriptionField.required = true;
            } else if (this.value === 'calendar') {
                projectDescription.classList.add('hidden');
                calendlySection.classList.remove('hidden');
                descriptionField.required = false;
            }
        });
    });

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.innerHTML = 'Sending...';
            submitButton.disabled = true;

            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                company: document.getElementById('company').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                contactType: document.querySelector('input[name="contactType"]:checked')?.value || 'other',
                description: document.getElementById('description').value || 'Calendly booking request'
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    form.innerHTML = `
                        <div class="text-center py-8">
                            <svg class="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <h3 class="mt-4 text-xl font-medium text-white">Message envoyé avec succès!</h3>
                            <p class="mt-2 text-white/80">Nous vous répondrons bientôt.</p>
                            <button onclick="window.location.reload()" class="mt-6 bg-gradient-to-r from-purple-500 to-violet-600 text-white px-6 py-2 rounded-md hover:opacity-90 transition-all font-semibold">
                                Envoyer un autre message
                            </button>
                        </div>
                    `;
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Submit';
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-md text-white text-center';
                errorDiv.innerHTML = 'Failed to send message. Please try again.';
                form.insertBefore(errorDiv, submitButton.parentElement);
                setTimeout(() => errorDiv.remove(), 5000);
            }
        });
    }
}); 