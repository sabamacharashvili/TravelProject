let bookingForm;
let bookingsList;

document.addEventListener("DOMContentLoaded", () => {
  bookingForm = document.getElementById("bookingForm");
  bookingsList = document.getElementById("bookingsList");

  loadBookings();

  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBookingSubmit);
  }
});

const destinationImages = {
  default:
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=300&fit=crop",
};

const API_BASE = "http://localhost:3001/tour";

async function handleBookingSubmit(e) {
  e.preventDefault();

  // For demo: use email as "creator" (should be user ID if logged in)
  const creator = document.getElementById("email").value;

  const formData = {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    destination: document.getElementById("destination").value,
    directions: document.getElementById("directions").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    creator: creator, // This should be a user ID in a real app
  };

  // Optional: check for empty fields
  for (const key in formData) {
    if (!formData[key]) {
      alert("Please fill all fields.");
      return;
    }
  }

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create booking");
    }

    alert("Booking created successfully!");
    e.target.reset();
    loadBookings();
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to create booking. " + error.message);
  }
}

async function loadBookings() {
  let retryCount = 0;
  const maxRetries = 3;

  async function tryLoadBookings() {
    try {
      const response = await fetch(API_BASE);

      if (!response.ok) {
        throw new Error("Failed to load bookings");
      }

      const bookings = await response.json();

      if (!bookingsList) {
        console.error("Bookings list element not found");
        return;
      }

      if (!bookings || bookings.length === 0) {
        bookingsList.innerHTML = '<p class="no-bookings">No bookings found</p>';
        return;
      }

      bookingsList.innerHTML = `
        <div class="bookings-grid">
          ${bookings
            .map(
              (booking) => `
              <div class="booking-card">
                <div class="booking-image">
                  <img src="${
                    destinationImages[booking.destination] ||
                    destinationImages.default
                  }" 
                  alt="${booking.destination}" 
                  onerror="this.src='${destinationImages.default}'">
                </div>
                <div class="booking-details">
                  <h3>${booking.destination}</h3>
                  <p><strong>Date:</strong> ${new Date(
                    booking.date
                  ).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> ${booking.time}</p>
                  <p><strong>Contact:</strong> ${booking.email} | ${
                booking.phone
              }</p>
                  <p><strong>Directions:</strong> ${booking.directions}</p>
                </div>
              </div>
            `
            )
            .join("")}
        </div>
      `;
    } catch (error) {
      console.error("Error loading bookings:", error);
      if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(tryLoadBookings, 1000);
      } else {
        if (bookingsList) {
          bookingsList.innerHTML =
            '<p class="error">Failed to load bookings. Please refresh the page.</p>';
        }
      }
    }
  }

  tryLoadBookings();
}
