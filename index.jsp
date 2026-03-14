<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travel Booking System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Welcome Screen -->
    <div id="welcomeScreen" class="container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div class="text-center">
            <div class="welcome-logo mb-4">
                <h1 class="logo-text">WELCOME</h1>
                <p class="tagline">"Experience the Best Travel"</p>
            </div>
            <button class="btn btn-primary btn-lg" onclick="showAuthScreen()">Get Started</button>
        </div>
    </div>

    <!-- Auth Screen (Login/Signup) -->
    <div id="authScreen" class="container-fluid vh-100 d-none">
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="#"><i class="bi bi-airplane"></i> Travel Booking</a>
            </div>
        </nav>
        
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <div class="card shadow">
                        <div class="card-body p-4">
                            <!-- Tab Navigation -->
                            <ul class="nav nav-tabs mb-4" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="login-tab" data-bs-toggle="tab" data-bs-target="#login" type="button">Login</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="signup-tab" data-bs-toggle="tab" data-bs-target="#signup" type="button">Signup</button>
                                </li>
                            </ul>

                            <!-- Tab Content -->
                            <div class="tab-content">
                                <!-- Login Form -->
                                <div class="tab-pane fade show active" id="login" role="tabpanel">
                                    <form onsubmit="handleLogin(event)">
                                        <div class="mb-3">
                                            <label class="form-label">Username</label>
                                            <input type="text" class="form-control" id="loginUsername" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Password</label>
                                            <input type="password" class="form-control" id="loginPassword" required>
                                        </div>
                                        <button type="submit" class="btn btn-primary w-100">Login</button>
                                    </form>
                                </div>


                                <!-- Signup Form -->


                                <div class="tab-pane fade" id="signup" role="tabpanel">
                                    <form onsubmit="handleSignup(event)">
                                        <div class="mb-3">
                                            <label class="form-label">Full Name</label>
                                            <input type="text" class="form-control" id="signupName" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Mobile Number</label>
                                            <input type="tel" class="form-control" id="signupMobile" pattern="[789][0-9]{9}" placeholder="10 digits starting with 7,8 or 9" required>
                                            <small class="text-muted">Must start with 7, 8 or 9</small>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Gmail</label>
                                            <input type="email" class="form-control" id="signupEmail" placeholder="example@gmail.com" required>                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Password</label>
                                            <input type="password" class="form-control" id="signupPassword" minlength="6" required>
                                            <small class="text-muted">Min 6 characters, include letters, numbers & special characters</small>
                                        </div>
                                        <button type="submit" class="btn btn-success w-100">Sign Up</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>



    <!-- Main Dashboard -->
    <div id="dashboardScreen" class="d-none">
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#"><i class="bi bi-airplane"></i> Travel Booking</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="#" onclick="showBooking()"><i class="bi bi-ticket"></i> Book Ticket</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" onclick="showBookings()"><i class="bi bi-list-ul"></i> My Bookings</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" onclick="showProfile()"><i class="bi bi-person"></i> Profile</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" onclick="handleLogout()"><i class="bi bi-box-arrow-right"></i> Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- Main Content Area -->
        <div class="container-fluid p-4">
            <!-- Dashboard Home -->
            <div id="dashboardHome" class="content-section">
                <div class="row">
                    <div class="col-12 mb-4">
                        <h2>Welcome, <span id="userName"></span>!</h2>
                        <p class="text-muted">What would you like to do today?</p>
                    </div>
                </div>
                
                <div class="row g-4">
                    <div class="col-md-3">
                        <div class="card dashboard-card text-center" onclick="showBooking()">
                            <div class="card-body">
                                <i class="bi bi-ticket-detailed display-4 text-primary"></i>
                                <h5 class="card-title mt-3">Book Ticket</h5>
                                <p class="card-text">Book your next journey</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card dashboard-card text-center" onclick="showBookings()">
                            <div class="card-body">
                                <i class="bi bi-list-check display-4 text-success"></i>
                                <h5 class="card-title mt-3">My Bookings</h5>
                                <p class="card-text">View & manage bookings</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card dashboard-card text-center" onclick="showProfile()">
                            <div class="card-body">
                                <i class="bi bi-person-circle display-4 text-info"></i>
                                <h5 class="card-title mt-3">Profile</h5>
                                <p class="card-text">View & edit profile</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card dashboard-card text-center" onclick="showHistory()">
                            <div class="card-body">
                                <i class="bi bi-clock-history display-4 text-warning"></i>
                                <h5 class="card-title mt-3">Travel History</h5>
                                <p class="card-text">View past bookings</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="row mt-4">
                    <div class="col-12">
                        <h4>Your Statistics</h4>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-light">
                            <div class="card-body">
                                <h6 class="text-muted">Total Bookings</h6>
                                <h3 id="totalBookings">0</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-light">
                            <div class="card-body">
                                <h6 class="text-muted">Active Bookings</h6>
                                <h3 id="activeBookings">0</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-light">
                            <div class="card-body">
                                <h6 class="text-muted">Total Spent</h6>
                                <h3 id="totalSpent">₹0</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Booking Section -->
            <div id="bookingSection" class="content-section d-none">
                <div class="row">
                    <div class="col-12 mb-4">
                        <button class="btn btn-secondary" onclick="showDashboardHome()"><i class="bi bi-arrow-left"></i> Back</button>
                        <h2 class="mt-3">Book Your Ticket</h2>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-8">
                        <div class="card">
                            <div class="card-body">
                                <form id="bookingForm">
                                    <!-- Step 1: Service Selection -->
                                    <div class="booking-step" id="step1">
                                        <h5 class="mb-4">Select Service</h5>
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <div class="service-card" onclick="selectService('Bus')">
                                                    <i class="bi bi-bus-front display-4"></i>
                                                    <h5 class="mt-2">Bus</h5>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="service-card" onclick="selectService('Train')">
                                                    <i class="bi bi-train-front display-4"></i>
                                                    <h5 class="mt-2">Train</h5>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="service-card" onclick="selectService('Flight')">
                                                    <i class="bi bi-airplane display-4"></i>
                                                    <h5 class="mt-2">Flight</h5>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="service-card" onclick="selectService('Ship')">
                                                    <i class="bi bi-water display-4"></i>
                                                    <h5 class="mt-2">Ship</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Step 2: Journey Details -->
                                    <div class="booking-step d-none" id="step2">
                                        <h5 class="mb-4">Journey Details</h5>
                                        
                                        <div class="mb-3">
                                            <label class="form-label">Select Operator</label>
                                            <select class="form-select" id="operatorSelect" required>
                                                <option value="">Choose operator</option>
                                            </select>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">From City</label>
                                                <input type="text" class="form-control" id="fromCity" required>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">To City</label>
                                                <input type="text" class="form-control" id="toCity" required>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Journey Date</label>
                                                <input type="date" class="form-control" id="journeyDate" required>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Journey Time</label>
                                                <input type="time" class="form-control" id="journeyTime" required>
                                            </div>
                                        </div>

                                        <div class="mb-3" id="typeSelection">
                                            <label class="form-label">Select Type/Class</label>
                                            <select class="form-select" id="typeSelect" required>
                                                <option value="">Choose type</option>
                                            </select>
                                        </div>

                                        <button type="button" class="btn btn-primary" onclick="goToStep3()">Next</button>
                                        <button type="button" class="btn btn-secondary" onclick="goToStep1()">Back</button>
                                    </div>

                                    <!-- Step 3: Passenger Details -->
                                    <div class="booking-step d-none" id="step3">
                                        <h5 class="mb-4">Passenger Details</h5>
                                        
                                        <div class="mb-3">
                                            <label class="form-label">Number of Passengers (1-5)</label>
                                            <input type="number" class="form-control" id="passengerCount" min="1" max="5" value="1" onchange="generatePassengerForms()">
                                        </div>

                                        <div id="passengerForms"></div>

                                        <div class="form-check mb-3">
                                            <input class="form-check-input" type="checkbox" id="luggageCheck">
                                            <label class="form-check-label" for="luggageCheck">
                                                Add Luggage (₹50 per passenger)
                                            </label>
                                        </div>

                                        <button type="button" class="btn btn-primary" onclick="goToStep4()">Next</button>
                                        <button type="button" class="btn btn-secondary" onclick="goToStep2()">Back</button>
                                    </div>

                                    <!-- Step 4: Payment -->
                                    <div class="booking-step d-none" id="step4">
                                        <h5 class="mb-4">Payment</h5>
                                        
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <h6>Bill Summary</h6>
                                                <div class="d-flex justify-content-between">
                                                    <span>Base Fare:</span>
                                                    <span id="baseFareDisplay">₹0</span>
                                                </div>
                                                <div class="d-flex justify-content-between">
                                                    <span>Subtotal:</span>
                                                    <span id="subtotalDisplay">₹0</span>
                                                </div>
                                                <div class="d-flex justify-content-between">
                                                    <span>GST (18%):</span>
                                                    <span id="gstDisplay">₹0</span>
                                                </div>
                                                <div class="d-flex justify-content-between text-success">
                                                    <span>Discount:</span>
                                                    <span id="discountDisplay">-₹0</span>
                                                </div>
                                                <hr>
                                                <div class="d-flex justify-content-between fw-bold">
                                                    <span>Total:</span>
                                                    <span id="totalDisplay">₹0</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">Coupon Code (Optional)</label>
                                            <div class="input-group">
                                                <input type="text" class="form-control" id="couponCode" placeholder="Enter coupon">
                                                <button class="btn btn-outline-secondary" type="button" onclick="applyCoupon()">Apply</button>
                                            </div>
                                            <small class="text-muted">Available: FIRST10 (10% off), SAVE20 (20% off), FLAT15 (5% off)</small>
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">Payment Method</label>
                                            <select class="form-select" id="paymentMethod" onchange="showPaymentFields()" required>
                                                <option value="">Select payment method</option>
                                                <option value="UPI">UPI</option>
                                                <option value="Cash">Cash</option>
                                                <option value="Card">Card</option>
                                            </select>
                                        </div>

                                        <div id="paymentFields"></div>

                                       <button type="submit" class="btn btn-success btn-lg w-100">Confirm Booking</button>
                                        <button type="button" class="btn btn-secondary mt-2" onclick="goToStep3()">Back</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Booking Summary Sidebar -->
                    <div class="col-lg-4">
                        <div class="card sticky-top" style="top: 20px;">
                            <div class="card-body">
                                <h6 class="card-title">Booking Summary</h6>
                                <div id="bookingSummary">
                                    <p class="text-muted">Select a service to begin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- My Bookings Section -->
            <div id="myBookingsSection" class="content-section d-none">
                <div class="row">
                    <div class="col-12 mb-4">
                        <button class="btn btn-secondary" onclick="showDashboardHome()"><i class="bi bi-arrow-left"></i> Back</button>
                        <h2 class="mt-3">My Bookings</h2>
                    </div>
                </div>
                <div id="bookingsList"></div>
            </div>

            <!-- Profile Section -->
            <div id="profileSection" class="content-section d-none">
                <div class="row">
                    <div class="col-12 mb-4">
                        <button class="btn btn-secondary" onclick="showDashboardHome()"><i class="bi bi-arrow-left"></i> Back</button>
                        <h2 class="mt-3">Profile</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <form id="profileForm" onsubmit="updateProfile(event)">
                                    <div class="mb-3">
                                        <label class="form-label">Name</label>
                                        <input type="text" class="form-control" id="profileName" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Mobile</label>
                                        <input type="tel" class="form-control" id="profileMobile" pattern="[789][0-9]{9}" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" id="profileEmail" pattern="^[a-zA-Z0-9._%+]+@gmail\.com$" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary">Update Profile</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Travel History Section -->
            <div id="historySection" class="content-section d-none">
                <div class="row">
                    <div class="col-12 mb-4">
                        <button class="btn btn-secondary" onclick="showDashboardHome()"><i class="bi bi-arrow-left"></i> Back</button>
                        <h2 class="mt-3">Travel History</h2>
                    </div>
                </div>
                <div id="historyList"></div>
            </div>
        </div>
    </div>

    <!-- Booking Receipt Modal -->
    <div class="modal fade" id="receiptModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Booking Receipt</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="receiptContent"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="window.print()">Print</button>
                </div>
            </div>
        </div>
    </div>

   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<script src="js/config.js"></script>
<script src="js/database.js"></script>
<script src="js/app.js"></script>
</body>
</html>