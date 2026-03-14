function getISTNow() {
    const now = new Date();
    const istOffset = 5.5 * 60; // minutes
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + istOffset * 60000);
}
// Global Variables
let currentUser = null;
let currentBooking = {
    service: '',
    operator: '',
    from: '',
    to: '',
    date: '',
    time: '',
    type: '',
    passengers: [],
    seats: [],
    baseFare: 0,
    subtotal: 0,
    gst: 0,
    discount: 0,
    total: 0,
    luggage: false
};

// Coupons
const COUPONS = {
    'FIRST10': 0.10,
    'SAVE20': 0.20,
    'FLAT15': 0.05
};

// City Multipliers
const CITY_MULTIPLIERS = {
    'DELHI_MUMBAI': 1.3,
    'MUMBAI_DELHI': 1.3,
    'HYDERABAD_BENGALURU': 1.1,
    'BENGALURU_HYDERABAD': 1.1,
    'KOLKATA_CHENNAI': 1.05
};

// Operators by Service
const OPERATORS = {
    'Bus': ['RedBus', 'TSRTC', 'VRL', 'Rajadhani'],
    'Train': ['IRCTC Express', 'Rajdhani', 'Shatabdi'],
    'Flight': ['Indigo', 'AirIndia', 'Vistara'],
    'Ship': ['Goa Ferries', 'SeaLines', 'Oceanic']
};

// Types/Classes by Service
const TYPES = {
    'Bus': [
        { value: 1, label: 'Non-AC Seater', baseMin: 200, baseMax: 500, capacity: 30 },
        { value: 2, label: 'AC Seater', baseMin: 300, baseMax: 700, capacity: 30 },
        { value: 3, label: 'AC Sleeper', baseMin: 600, baseMax: 1200, capacity: 30 },
        { value: 4, label: 'Luxury Volvo', baseMin: 900, baseMax: 1500, capacity: 30 }
    ],
    'Train': [
        { value: 1, label: 'Sleeper (SL)', baseMin: 150, baseMax: 400, capacity: 72 },
        { value: 2, label: '3AC', baseMin: 450, baseMax: 900, capacity: 72 },
        { value: 3, label: '2AC', baseMin: 800, baseMax: 1500, capacity: 72 },
        { value: 4, label: '1AC', baseMin: 1500, baseMax: 2500, capacity: 72 }
    ],
    'Flight': [
        { value: 1, label: 'Economy', baseMin: 2500, baseMax: 6000, capacity: 120 },
        { value: 2, label: 'Premium Economy', baseMin: 6000, baseMax: 9000, capacity: 120 },
        { value: 3, label: 'Business', baseMin: 9000, baseMax: 15000, capacity: 120 }
    ],
    'Ship': [
        { value: 1, label: 'Deck', baseMin: 500, baseMax: 1200, capacity: 200 },
        { value: 2, label: 'Cabin', baseMin: 1200, baseMax: 3000, capacity: 200 },
        { value: 3, label: 'Deluxe Suite', baseMin: 3000, baseMax: 6000, capacity: 200 }
    ]
};

// Utility Functions
function showToast(message, type = 'info') {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.innerHTML = `
        <div class="toast custom-toast align-items-center text-white bg-${type} border-0 show" role="alert">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    document.body.appendChild(toastContainer);
    
    setTimeout(() => {
        toastContainer.remove();
    }, 3000);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function formatTime(timeStr) {
    return timeStr;
}

function generateBookingId(service) {
    const prefix = service.substring(0, 3).toUpperCase();
    const number = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${number}`;
}

function getJourneyKey(service, from, to, date, time) {
    return `${service}|${from.toUpperCase()}|${to.toUpperCase()}|${date}|${time}`.replace(/\s+/g, '_');
}

function getCityMultiplier(from, to) {
    const key = `${from.toUpperCase()}_${to.toUpperCase()}`.replace(/\s+/g, '_');
    return CITY_MULTIPLIERS[key] || 1.0;
}

function getRandomFare(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Screen Navigation
function showAuthScreen() {
    document.getElementById('welcomeScreen').classList.add('d-none');
    document.getElementById('authScreen').classList.remove('d-none');
}
function showDashboard() {
    if (!currentUser) {
        showToast("Please login first", "warning");
        showAuthScreen();   // send user to login page
        return;
    }

    document.getElementById('authScreen').classList.add('d-none');
    document.getElementById('dashboardScreen').classList.remove('d-none');
    document.getElementById('userName').textContent = currentUser.name;

    updateDashboardStats();
    showDashboardHome();
}



function showDashboardHome() {
    hideAllSections();
    document.getElementById('dashboardHome').classList.remove('d-none');
    updateDashboardStats();
}

function showBooking() {
    hideAllSections();
    document.getElementById('bookingSection').classList.remove('d-none');
    resetBookingForm();
}

function showBookings() {
    hideAllSections();
    document.getElementById('myBookingsSection').classList.remove('d-none');
    loadBookings();
}

function showProfile() {
    hideAllSections();
    document.getElementById('profileSection').classList.remove('d-none');
    loadProfile();
}

function showHistory() {
    hideAllSections();
    document.getElementById('historySection').classList.remove('d-none');
    loadHistory();
}

function hideAllSections() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('d-none'));
}

// Authentication
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const mobile = document.getElementById('signupMobile').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&^#()_+=<>/\-]).{6,}$/;
    if (!passwordRegex.test(password)) {
        showToast('Password must contain letters, numbers, special characters and be at least 6 characters', 'danger');
        return;
    }

    fetch('signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `name=${encodeURIComponent(name)}&mobile=${encodeURIComponent(mobile)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
    .then(async res => {
        if (!res.ok) {
            const msg = await res.text();
            showToast(msg || "Signup failed", "danger");
            return;
        }

        showToast('Signup successful! Please login.', 'success');

        // Clear form
        document.getElementById('signupName').value = '';
        document.getElementById('signupMobile').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';

        // 🔥 Switch to login tab
        const loginTab = document.getElementById('login-tab');
        const tab = new bootstrap.Tab(loginTab);
        tab.show();
document.getElementById('loginUsername').value = email;
    })
    .catch(err => {
        console.error(err);
        showToast("Server error during signup", "danger");
    });
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    fetch("login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {

    currentUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        mobile: data.mobile
    };

    DB.session.set(currentUser);  // store login session

    showToast("Welcome " + data.name, "success");
    showDashboard();
} else if (data.status === "fail") {
            showToast("Invalid email or password", "danger");
        } else {
            showToast("Server error", "danger");
        }
    })
    .catch(err => {
        console.error(err);
        showToast("Server error", "danger");
    });
}

// Dashboard Stats
function updateDashboardStats() {
    const bookings = DB.bookings.getByUserId(currentUser.id);
    const activeBookings = bookings.filter(b => !b.cancelled);
    const totalSpent = bookings.reduce((sum, b) => sum + (b.total || 0), 0);
    
    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('activeBookings').textContent = activeBookings.length;
    document.getElementById('totalSpent').textContent = `₹${totalSpent.toFixed(2)}`;
}

// Booking Flow
function resetBookingForm() {
    currentBooking = {
        service: '',
        operator: '',
        from: '',
        to: '',
        date: '',
        time: '',
        type: '',
        passengers: [],
        seats: [],
        baseFare: 0,
        subtotal: 0,
        gst: 0,
        discount: 0,
        total: 0,
        luggage: false
    };
    
    // Show step 1
    document.querySelectorAll('.booking-step').forEach(step => step.classList.add('d-none'));
    document.getElementById('step1').classList.remove('d-none');
    
    // Reset form
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingSummary').innerHTML = '<p class="text-muted">Select a service to begin</p>';
    
    // Remove selected class from service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('selected');
    });
}

function selectService(service) {
    currentBooking.service = service;
    
    // Update UI
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.service-card').classList.add('selected');
    
    // Populate operators
    const operatorSelect = document.getElementById('operatorSelect');
    operatorSelect.innerHTML = '<option value="">Choose operator</option>';
    OPERATORS[service].forEach(op => {
        operatorSelect.innerHTML += `<option value="${op}">${op}</option>`;
    });
    
    // Populate types
    const typeSelect = document.getElementById('typeSelect');
    typeSelect.innerHTML = '<option value="">Choose type</option>';
    TYPES[service].forEach(type => {
        typeSelect.innerHTML += `<option value="${type.value}">${type.label}</option>`;
    });
    
    updateBookingSummary();
    
    setTimeout(() => goToStep2(), 500);
}

function goToStep1() {
    document.querySelectorAll('.booking-step').forEach(step => step.classList.add('d-none'));
    document.getElementById('step1').classList.remove('d-none');
}

function goToStep2() {
    document.querySelectorAll('.booking-step').forEach(step => step.classList.add('d-none'));
    document.getElementById('step2').classList.remove('d-none');

    const istNow = getISTNow();
    const yyyy = istNow.getFullYear();
    const mm = String(istNow.getMonth() + 1).padStart(2, '0');
    const dd = String(istNow.getDate()).padStart(2, '0');

    document.getElementById('journeyDate').min = `${yyyy}-${mm}-${dd}`;
}

function goToStep3() {
    // Validate step 2
    const operator = document.getElementById('operatorSelect').value;
    const from = document.getElementById('fromCity').value.trim();
    const to = document.getElementById('toCity').value.trim();
    const date = document.getElementById('journeyDate').value;
    const time = document.getElementById('journeyTime').value;
    const typeValue = document.getElementById('typeSelect').value;
    
    if (!operator || !from || !to || !date || !time || !typeValue) {
        showToast('Please fill all fields', 'warning');
        return;
    }
    
    if (from.toLowerCase() === to.toLowerCase()) {
        showToast('FROM and TO cities cannot be same!', 'danger');
        return;
    }

    // ✅ Indian Time Validation (Date + Time)
    const selectedDateTime = new Date(date + "T" + time);
    const istNow = getISTNow();

    if (selectedDateTime < istNow) {
        showToast("You cannot book past date or time (IST)", "danger");
        return;
    }
    
    // Save data
    currentBooking.operator = operator;
    currentBooking.from = from;
    currentBooking.to = to;
    currentBooking.date = date;
    currentBooking.time = time;
    currentBooking.typeValue = typeValue;
    
    // Get type details
    const typeDetails = TYPES[currentBooking.service].find(t => t.value == typeValue);
    currentBooking.type = typeDetails.label;
    currentBooking.capacity = typeDetails.capacity;
    
    // Calculate base fare
    const multiplier = getCityMultiplier(from, to);
    currentBooking.baseFare = Math.round(getRandomFare(typeDetails.baseMin, typeDetails.baseMax) * multiplier);
    
    updateBookingSummary();
    
    document.querySelectorAll('.booking-step').forEach(step => step.classList.add('d-none'));
    document.getElementById('step3').classList.remove('d-none');
    
    generatePassengerForms();
}

function generatePassengerForms() {
    const count = parseInt(document.getElementById('passengerCount').value);
    const container = document.getElementById('passengerForms');
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        container.innerHTML += `
            <div class="passenger-form">
                <h6>Passenger ${i + 1}</h6>
                <div class="row">
                    <div class="col-md-4 mb-2">
                        <input type="text" class="form-control" placeholder="Name" id="pName${i}" required>
                    </div>
                    <div class="col-md-4 mb-2">
                        <input type="number" class="form-control" placeholder="Age" id="pAge${i}" min="0" max="150" required>
                    </div>
                    <div class="col-md-4 mb-2">
                        <select class="form-select" id="pGender${i}" required>
                            <option value="">Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                </div>
                <div class="mt-2">
                    <label class="form-label">Select Seat</label>
                    <div id="seatMap${i}"></div>
                </div>
            </div>
        `;
    }
    
    // Generate seat maps
    for (let i = 0; i < count; i++) {
        generateSeatMap(i);
    }
}

function generateSeatMap(passengerIndex) {
    const journeyKey = getJourneyKey(
        currentBooking.service,
        currentBooking.from,
        currentBooking.to,
        currentBooking.date,
        currentBooking.time
    );
    
    const bookedSeats = DB.seatMap.getJourney(journeyKey);
    const seatMapDiv = document.getElementById(`seatMap${passengerIndex}`);
    
    let html = '<div class="seat-map">';
    for (let s = 1; s <= Math.min(40, currentBooking.capacity); s++) {
        const seatId = `S${s}`;
        const isBooked = bookedSeats.includes(seatId);
        const isSelected = currentBooking.seats.includes(seatId);
        
        let className = 'seat';
        if (isBooked) className += ' booked';
        if (isSelected) className += ' selected';
        
        html += `<div class="${className}" onclick="selectSeat('${seatId}', ${passengerIndex})" data-seat="${seatId}">${seatId}</div>`;
    }
    html += '</div>';
    
    seatMapDiv.innerHTML = html;
}

function selectSeat(seatId, passengerIndex) {
    const journeyKey = getJourneyKey(
        currentBooking.service,
        currentBooking.from,
        currentBooking.to,
        currentBooking.date,
        currentBooking.time
    );
    
    const bookedSeats = DB.seatMap.getJourney(journeyKey);
    
    if (bookedSeats.includes(seatId)) {
        showToast('Seat already booked!', 'warning');
        return;
    }
    
    // Remove previous selection for this passenger
    if (currentBooking.seats[passengerIndex]) {
        const prevSeat = currentBooking.seats[passengerIndex];
        document.querySelectorAll(`[data-seat="${prevSeat}"]`).forEach(el => {
            el.classList.remove('selected');
        });
    }
    
    // Add new selection
    currentBooking.seats[passengerIndex] = seatId;
    document.querySelectorAll(`[data-seat="${seatId}"]`).forEach(el => {
        el.classList.add('selected');
    });
}

function goToStep4() {
    // Validate passengers
    const count = parseInt(document.getElementById('passengerCount').value);
    const passengers = [];
    
    for (let i = 0; i < count; i++) {
        const name = document.getElementById(`pName${i}`).value.trim();
        const age = document.getElementById(`pAge${i}`).value;
        const gender = document.getElementById(`pGender${i}`).value;
        
        if (!name || !age || !gender) {
            showToast('Please fill all passenger details', 'warning');
            return;
        }
        
        if (!currentBooking.seats[i]) {
            showToast(`Please select seat for Passenger ${i + 1}`, 'warning');
            return;
        }
        
        passengers.push({ name, age: parseInt(age), gender });
    }
    
    currentBooking.passengers = passengers;
    currentBooking.luggage = document.getElementById('luggageCheck').checked;
    
    // Calculate totals
    calculateBill();
    
    document.querySelectorAll('.booking-step').forEach(step => step.classList.add('d-none'));
    document.getElementById('step4').classList.remove('d-none');
    
    updateBookingSummary();
}

function calculateBill() {
    const count = currentBooking.passengers.length;
    const luggageTotal = currentBooking.luggage ? 50 * count : 0;
    
    currentBooking.subtotal = (currentBooking.baseFare * count) + luggageTotal;
    currentBooking.gst = currentBooking.subtotal * 0.18;
    currentBooking.total = currentBooking.subtotal + currentBooking.gst - currentBooking.discount;
    
    // Update UI
    document.getElementById('baseFareDisplay').textContent = `₹${currentBooking.baseFare}`;
    document.getElementById('subtotalDisplay').textContent = `₹${currentBooking.subtotal.toFixed(2)}`;
    document.getElementById('gstDisplay').textContent = `₹${currentBooking.gst.toFixed(2)}`;
    document.getElementById('discountDisplay').textContent = `-₹${currentBooking.discount.toFixed(2)}`;
    document.getElementById('totalDisplay').textContent = `₹${currentBooking.total.toFixed(2)}`;
}

function applyCoupon() {
    const code = document.getElementById('couponCode').value.trim().toUpperCase();
    
    if (!code) {
        showToast('Please enter coupon code', 'warning');
        return;
    }
    
    if (COUPONS[code]) {
        currentBooking.discount = currentBooking.subtotal * COUPONS[code];
        currentBooking.couponCode = code;
        calculateBill();
        showToast(`Coupon applied! ${(COUPONS[code] * 100)}% discount`, 'success');
    } else {
        showToast('Invalid coupon code', 'danger');
    }
}

function showPaymentFields() {
    const method = document.getElementById('paymentMethod').value;
    const container = document.getElementById('paymentFields');
    
    if (method === 'UPI') {
        container.innerHTML = `
            <div class="mb-3">
                <label class="form-label">UPI ID</label>
                <input type="text" class="form-control" id="upiId" placeholder="example@upi" pattern="[a-zA-Z0-9._\\-]{3,}@[a-zA-Z]{3,}" required>
            </div>
        `;
    } else if (method === 'Card') {
        container.innerHTML = `
            <div class="mb-3">
                <label class="form-label">Card Number</label>
                <input type="text" class="form-control" id="cardNumber" placeholder="16 digits" pattern="\\d{16}" maxlength="16" required>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Expiry (MM/YY)</label>
                    <input type="text" class="form-control" id="cardExpiry" placeholder="MM/YY" pattern="\\d{2}/\\d{2}" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">CVV</label>
                    <input type="text" class="form-control" id="cardCvv" placeholder="4 digits" pattern="\\d{4}" maxlength="4" required>
                </div>
            </div>
        `;
    } else if (method === 'Cash') {
        container.innerHTML = `
            <div class="alert alert-info">Cash payment will be collected on arrival</div>
        `;
    } else {
        container.innerHTML = '';
    }
}

// Handle booking form submission
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingSubmit();
        });
    }
    
    // Check if user is logged in
    const savedUser = DB.session.get();
    if (savedUser) {
        currentUser = savedUser;
        showDashboard();
    }
});

function handleBookingSubmit() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    if (!paymentMethod) {
        showToast('Please select payment method', 'warning');
        return;
    }

    // 1️⃣ Prepare data for backend (MySQL)
    const formData = new URLSearchParams();
    formData.append("service", currentBooking.service);
    formData.append("operator", currentBooking.operator);
    formData.append("from", currentBooking.from);
    formData.append("to", currentBooking.to);
    formData.append("date", currentBooking.date);
    formData.append("time", currentBooking.time);
    formData.append("type", currentBooking.type);
    formData.append("passengers", currentBooking.passengers.length);
    formData.append("total", currentBooking.total);
    formData.append("payment", paymentMethod);

    // 2️⃣ Send to MySQL
    fetch("bookTicket", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
    })
    .then(res => res.text())
    .then(data => {
        console.log("Saved in MySQL:", data);

        // 3️⃣ ALSO save in browser DB
        const booking = {
            bookingId: generateBookingId(currentBooking.service),
            userId: currentUser.id,
            service: currentBooking.service,
            operator: currentBooking.operator,
            from: currentBooking.from,
            to: currentBooking.to,
            date: currentBooking.date,
            time: currentBooking.time,
            type: currentBooking.type,
            passengers: currentBooking.passengers,
            seats: currentBooking.seats,
            total: currentBooking.total,
            paymentMethod,
            luggage: currentBooking.luggage,
            cancelled: false,
            createdAt: new Date().toISOString(),
            rating: 0,
            feedback: ''
        };

        DB.bookings.create(booking);   // 👈 Save in browser

        // 4️⃣ Show receipt
        showReceipt(booking);

        resetBookingForm();
        showToast("Booking saved in browser + MySQL!", "success");
    })
    .catch(err => {
        console.error(err);
        showToast("Server error", "danger");
    });
}


function showReceipt(booking) {
    const modal = new bootstrap.Modal(document.getElementById('receiptModal'));
    const content = document.getElementById('receiptContent');
    
    let passengersHtml = '';
    booking.passengers.forEach((p, i) => {
        passengersHtml += `
            <tr>
                <td>${i + 1}</td>
                <td>${p.name}</td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td>${booking.seats[i] || '-'}</td>
            </tr>
        `;
    });
    
    content.innerHTML = `
        <div class="receipt">
            <div class="receipt-header text-center">
                <h3>BOOKING RECEIPT</h3>
                <p class="text-success fw-bold">PAYMENT SUCCESSFUL</p>
            </div>
            
            <div class="receipt-row">
                <strong>Booking ID:</strong>
                <span>${booking.bookingId}</span>
            </div>
            <div class="receipt-row">
                <strong>Service:</strong>
                <span>${booking.service} (${booking.operator})</span>
            </div>
            <div class="receipt-row">
                <strong>Route:</strong>
                <span>${booking.from} → ${booking.to}</span>
            </div>
            <div class="receipt-row">
                <strong>Date & Time:</strong>
                <span>${formatDate(booking.date)} at ${booking.time}</span>
            </div>
            <div class="receipt-row">
                <strong>Type/Class:</strong>
                <span>${booking.type}</span>
            </div>
            
            <h6 class="mt-4 mb-3">Passengers & Seats:</h6>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Seat</th>
                    </tr>
                </thead>
                <tbody>
                    ${passengersHtml}
                </tbody>
            </table>
            
            <div class="receipt-row">
                <strong>Total Fare:</strong>
                <span class="receipt-total">₹${booking.total.toFixed(2)}</span>
            </div>
            <div class="receipt-row">
                <strong>Payment Mode:</strong>
                <span>${booking.paymentMethod}</span>
            </div>
            
            <div class="text-center mt-4">
                <p class="text-muted">Thank you for booking with us!</p>
            </div>
        </div>
    `;
    
    modal.show();
    
    // After showing receipt, ask for rating
    setTimeout(() => {
        const rating = prompt('Rate your booking experience (1-5):');
        if (rating && rating >= 1 && rating <= 5) {
            const feedback = prompt('Any feedback? (Optional)');
            DB.bookings.update(booking.bookingId, {
                rating: parseInt(rating),
                feedback: feedback || ''
            });
            showToast('Thank you for your rating!', 'success');
        }
    }, 1000);
}

function updateBookingSummary() {
    const summary = document.getElementById('bookingSummary');
    
    if (!currentBooking.service) {
        summary.innerHTML = '<p class="text-muted">Select a service to begin</p>';
        return;
    }
    
    let html = `
        <div class="mb-2"><strong>Service:</strong> ${currentBooking.service}</div>
    `;
    
    if (currentBooking.operator) {
        html += `<div class="mb-2"><strong>Operator:</strong> ${currentBooking.operator}</div>`;
    }
    
    if (currentBooking.from && currentBooking.to) {
        html += `<div class="mb-2"><strong>Route:</strong> ${currentBooking.from} → ${currentBooking.to}</div>`;
    }
    
    if (currentBooking.date) {
        html += `<div class="mb-2"><strong>Date:</strong> ${formatDate(currentBooking.date)}</div>`;
    }
    
    if (currentBooking.time) {
        html += `<div class="mb-2"><strong>Time:</strong> ${currentBooking.time}</div>`;
    }
    
    if (currentBooking.type) {
        html += `<div class="mb-2"><strong>Type:</strong> ${currentBooking.type}</div>`;
    }
    
    if (currentBooking.baseFare) {
        html += `<div class="mb-2"><strong>Base Fare:</strong> ₹${currentBooking.baseFare}</div>`;
    }
    
    if (currentBooking.passengers.length > 0) {
        html += `<div class="mb-2"><strong>Passengers:</strong> ${currentBooking.passengers.length}</div>`;
    }
    
    if (currentBooking.total) {
        html += `<div class="mt-3 pt-3 border-top"><strong>Total:</strong> <span class="text-success fs-5">₹${currentBooking.total.toFixed(2)}</span></div>`;
    }
    
    summary.innerHTML = html;
}

// Load Bookings
function loadBookings() {
    const bookings = DB.bookings.getByUserId(currentUser.id);
    const container = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No bookings found</div>';
        return;
    }
    
    let html = '';
    bookings.forEach(booking => {
        const statusClass = booking.cancelled ? 'status-cancelled' : 'status-active';
        const statusText = booking.cancelled ? 'CANCELLED' : 'ACTIVE';
        
        html += `
            <div class="card booking-card ${booking.cancelled ? 'cancelled' : ''}">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h5>${booking.bookingId}</h5>
                            <p class="mb-1"><strong>${booking.service}</strong> - ${booking.operator}</p>
                            <p class="mb-1">${booking.from} → ${booking.to}</p>
                            <p class="mb-0 text-muted">${formatDate(booking.date)} at ${booking.time}</p>
                        </div>
                        <div class="col-md-4 text-end">
                            <span class="status-badge ${statusClass}">${statusText}</span>
                            <h5 class="mt-2">₹${booking.total.toFixed(2)}</h5>
                            <button class="btn btn-sm btn-primary mt-2" onclick="viewBookingDetails('${booking.bookingId}')">View Details</button>
                            ${!booking.cancelled ? `<button class="btn btn-sm btn-danger mt-2" onclick="cancelBooking('${booking.bookingId}')">Cancel</button>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function viewBookingDetails(bookingId) {
    const booking = DB.bookings.findById(bookingId);
    if (booking) {
        showReceipt(booking);
    }
}

function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    const booking = DB.bookings.findById(bookingId);
    
    if (booking.cancelled) {
        showToast('Booking already cancelled', 'warning');
        return;
    }
    
    if (new Date(booking.date) < new Date()) {
        showToast('Cannot cancel past bookings', 'danger');
        return;
    }
    
    // Release seats
    const journeyKey = getJourneyKey(
        booking.service,
        booking.from,
        booking.to,
        booking.date,
        booking.time
    );
    DB.seatMap.releaseSeats(journeyKey, booking.seats);
    
    // Cancel booking
    DB.bookings.cancel(bookingId);
    
    showToast('Booking cancelled. Refund will be processed.', 'success');
    loadBookings();
    updateDashboardStats();
}

// Profile
function loadProfile() {
    document.getElementById('profileName').value = currentUser.name;
    document.getElementById('profileMobile').value = currentUser.mobile;
    document.getElementById('profileEmail').value = currentUser.email;
}

function updateProfile(event) {
    event.preventDefault();
    
    const name = document.getElementById('profileName').value.trim();
    const mobile = document.getElementById('profileMobile').value.trim();
    const email = document.getElementById('profileEmail').value.trim();
    
    DB.users.update(currentUser.id, { name, mobile, email });
    currentUser.name = name;
    currentUser.mobile = mobile;
    currentUser.email = email;
    
    DB.session.set(currentUser);
    
    showToast('Profile updated successfully!', 'success');
    document.getElementById('userName').textContent = name;
}

// Travel History
function loadHistory() {
    const bookings = DB.bookings.getByUserId(currentUser.id);
    const container = document.getElementById('historyList');
    
    if (bookings.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No travel history</div>';
        return;
    }
    
    // Sort by date
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    let html = '<div class="table-responsive"><table class="table table-hover"><thead><tr><th>Booking ID</th><th>Service</th><th>Route</th><th>Date</th><th>Status</th><th>Amount</th></tr></thead><tbody>';
    
    bookings.forEach(booking => {
        const statusClass = booking.cancelled ? 'text-danger' : 'text-success';
        const statusText = booking.cancelled ? 'CANCELLED' : 'COMPLETED';
        
        html += `
            <tr onclick="viewBookingDetails('${booking.bookingId}')" style="cursor: pointer;">
                <td>${booking.bookingId}</td>
                <td>${booking.service}</td>
                <td>${booking.from} → ${booking.to}</td>
                <td>${formatDate(booking.date)}</td>
                <td class="${statusClass}">${statusText}</td>
                <td>₹${booking.total.toFixed(2)}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}