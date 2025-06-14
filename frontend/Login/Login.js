document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");

  if (form) {
    form.addEventListener("submit", handleLogin);
  }
});

async function handleLogin(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  if (!data.email || !data.password) {
    alert("Fill all fields");
    return;
  }

  try {
    const testResponse = await fetch("http://localhost:3001/test");
    if (!testResponse.ok) {
      throw new Error("Server is not responding");
    }

    const response = await fetch("http://localhost:3001/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      if (result.token) {
        localStorage.setItem("token", result.token);
        alert("Succesfully authorised!");
        window.location.href = "../Booking/Booking.html";

        throw new Error("Token not received");
        console.log(Error);
        
      }
    } else {
      throw new Error(result.message || "Authorization failed");
    }
  } catch (error) {
    console.error("error:", error);
    if (error.message === "Failed to fetch") {
      alert(
        "Unable to connect to the server. Please check if the server is running."
      );
    } else {
      alert(error.message || "An error occurred");
    }
  }
}
