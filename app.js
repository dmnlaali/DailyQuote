document.addEventListener("DOMContentLoaded", () => {
    const quoteText = document.getElementById('quote-text');
    const timeLeft = document.getElementById('time-left');
    const shareTwitter = document.getElementById('share-twitter');

    // Set initial theme based on local storage or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    // Function to change theme
    function setTheme(theme) {
        document.body.className = theme + '-mode';
        localStorage.setItem('theme', theme); // Save the selected theme to local storage
    }

    // Fetch the daily quote
    fetch('quotes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const index = parseInt(today, 10) % data.length;
            const quote = data[index];
            quoteText.textContent = quote;

            // Update Twitter share link
            shareTwitter.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)}`;

            // Update time left
            updateCountdown();
            setInterval(updateCountdown, 1000); // Update every second
        })
        .catch(error => {
            console.error('Error fetching quote:', error);
            quoteText.textContent = 'Sorry, we could not load the quote at this time.';
        });

    function updateCountdown() {
        const now = new Date();
        const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const timeDiff = nextDay - now;

        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        timeLeft.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }

    // Ensure the buttons call the setTheme function
    document.querySelectorAll('.theme-switcher button').forEach(button => {
        button.addEventListener('click', () => {
            setTheme(button.textContent.toLowerCase().replace(' mode', ''));
        });
    });
});
