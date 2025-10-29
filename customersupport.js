document.addEventListener('DOMContentLoaded', function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isOpen = content.classList.contains('open');
            accordionHeaders.forEach(otherHeader => {
                const otherContent = otherHeader.nextElementSibling;
                if (otherHeader !== this && otherContent && otherContent.classList.contains('open')) {
                    otherContent.classList.remove('open');
                    otherHeader.classList.remove('active');
                }
            });
            if (isOpen) {
                content.classList.remove('open');
                this.classList.remove('active');
            } else {               
                content.classList.add('open');
                this.classList.add('active');
            }
        });
    });
});