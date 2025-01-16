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
            } else {
                projectDescription.classList.add('hidden');
                calendlySection.classList.remove('hidden');
                descriptionField.required = false;
            }
        });
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            company: formData.get('company'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            contactType: formData.get('contactType'),
            description: formData.get('description')
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Thank you for your submission!');
                form.reset();
            } else {
                throw new Error('Something went wrong');
            }
        } catch (error) {
            alert('Error submitting form. Please try again.');
            console.error('Error:', error);
        }
    });
}); 