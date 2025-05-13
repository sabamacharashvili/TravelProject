
let bookingForm;
let bookingsList;


document.addEventListener('DOMContentLoaded', () => {
   
    bookingForm = document.getElementById('bookingForm');
    bookingsList = document.getElementById('bookingsList');

    loadBookings();

    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
});


let bookedTours = new Set();


const destinationImages = {
    
    'default': 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=300&fit=crop'
};



async function handleBookingSubmit(e) {
    e.preventDefault();
    console.log('Form submitted');

    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        destination: document.getElementById('destination').value,
        directions: document.getElementById('directions').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value
    };

    try {
        const response = await fetch('http://localhost:3001/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to create booking');
        }

        alert('Booking created successfully!');
        e.target.reset();
        loadBookings();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to create booking. Please try again.');
    }
}

async function loadBookings() {
    const bookingsList = document.getElementById('bookingsList');
    let retryCount = 0;
    const maxRetries = 3;
    
    async function tryLoadBookings() {
        try {
            const response = await fetch('http://localhost:3001/booking');
            
            if (!response.ok) {
                throw new Error('Failed to load bookings');
            }

            const bookings = await response.json();
            
            if (!bookingsList) {
                console.error('Bookings list element not found');
                return;
            }

            if (!bookings || bookings.length === 0) {
                bookingsList.innerHTML = '<p class="no-bookings">No bookings found</p>';
                return;
            }

            bookingsList.innerHTML = `
                <style>
                    .bookings-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                        gap: 20px;
                        padding: 20px;
                    }
                    .booking-card {
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        overflow: hidden;
                        transition: transform 0.2s;
                    }
                    .booking-card:hover {
                        transform: translateY(-5px);
                    }
                    .booking-image {
                        width: 100%;
                        height: 200px;
                        overflow: hidden;
                        position: relative;
                    }
                    .booking-image::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3));
                        z-index: 1;
                    }
                    .booking-image img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.3s ease;
                    }
                    .booking-card:hover .booking-image img {
                        transform: scale(1.05);
                    }
                    .booking-details {
                        padding: 15px;
                    }
                    .booking-card h3 {
                        margin: 0 0 10px 0;
                        color: #333;
                        font-size: 1.2em;
                    }
                    .booking-card p {
                        margin: 5px 0;
                        color: #666;
                        font-size: 0.9em;
                    }
                    .book-now-btn {
                        background: #4CAF50;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        width: 100%;
                        margin-top: 10px;
                        transition: background 0.3s;
                    }
                    .book-now-btn:hover {
                        background: #45a049;
                    }
                    .book-now-btn:disabled {
                        background: #cccccc;
                        cursor: not-allowed;
                    }
                </style>
                <div class="bookings-grid">
                    ${bookings.map(booking => `
                        <div class="booking-card">
                            <div class="booking-image">
                                <img src="${destinationImages[booking.destination] || destinationImages.default}" 
                                     alt="${booking.destination}" 
                                     onerror="this.src='${destinationImages.default}'">
                            </div>
                            <div class="booking-details">
                                <h3>${booking.destination}</h3>
                                <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> ${booking.time}</p>
                                <p><strong>Contact:</strong> ${booking.email} | ${booking.phone}</p>
                                <p><strong>Directions:</strong> ${booking.directions}</p>
                                <button onclick="bookNow('${booking._id}')" class="book-now-btn" id="btn-${booking._id}">
                                    ${bookedTours.has(booking._id) ? 'Already Booked' : 'Book Now'}
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Error loading bookings:', error);
            if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying... Attempt ${retryCount} of ${maxRetries}`);
                setTimeout(tryLoadBookings, 1000);
            } else {
                if (bookingsList) {
                    bookingsList.innerHTML = '<p class="error">Failed to load bookings. Please refresh the page.</p>';
                }
            }
        }
    }

    tryLoadBookings();
}

function bookNow(bookingId) {
    if (bookedTours.has(bookingId)) {
        alert('You have already booked this trip!');
        return;
    }

    bookedTours.add(bookingId);
    const button = document.getElementById(`btn-${bookingId}`);
    if (button) {
        button.textContent = 'Already Booked';
        button.disabled = true;
    }
    alert('Successfully booked trip!');
}

