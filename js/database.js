// Database Management using LocalStorage
const DB = {
    // Initialize database
    init() {
        if (!localStorage.getItem('tbs_users')) {
            localStorage.setItem('tbs_users', JSON.stringify([]));
        }
        if (!localStorage.getItem('tbs_bookings')) {
            localStorage.setItem('tbs_bookings', JSON.stringify([]));
        }
        if (!localStorage.getItem('tbs_seatMap')) {
            localStorage.setItem('tbs_seatMap', JSON.stringify({}));
        }
    },

    // User Operations
    users: {
        getAll() {
            return JSON.parse(localStorage.getItem('tbs_users') || '[]');
        },
        
        findByEmail(email) {
            const users = this.getAll();
            return users.find(u => u.email === email);
        },
        
        findByUsername(username) {
            const users = this.getAll();
            return users.find(u => u.name === username);
        },
        
        create(userData) {
            const users = this.getAll();
            const newUser = {
                id: Date.now().toString(),
                name: userData.name,
                mobile: userData.mobile,
                email: userData.email,
                password: userData.password,
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            localStorage.setItem('tbs_users', JSON.stringify(users));
            return newUser;
        },
        
        update(userId, updates) {
            const users = this.getAll();
            const index = users.findIndex(u => u.id === userId);
            if (index !== -1) {
                users[index] = { ...users[index], ...updates };
                localStorage.setItem('tbs_users', JSON.stringify(users));
                return users[index];
            }
            return null;
        }
    },

    // Booking Operations
    bookings: {
        getAll() {
            return JSON.parse(localStorage.getItem('tbs_bookings') || '[]');
        },
        
        getByUserId(userId) {
            const bookings = this.getAll();
            return bookings.filter(b => b.userId === userId);
        },
        
        findById(bookingId) {
            const bookings = this.getAll();
            return bookings.find(b => b.bookingId === bookingId);
        },
        
        create(bookingData) {
            const bookings = this.getAll();
            bookings.push(bookingData);
            localStorage.setItem('tbs_bookings', JSON.stringify(bookings));
            return bookingData;
        },
        
        update(bookingId, updates) {
            const bookings = this.getAll();
            const index = bookings.findIndex(b => b.bookingId === bookingId);
            if (index !== -1) {
                bookings[index] = { ...bookings[index], ...updates };
                localStorage.setItem('tbs_bookings', JSON.stringify(bookings));
                return bookings[index];
            }
            return null;
        },
        
        cancel(bookingId) {
            return this.update(bookingId, { cancelled: true });
        }
    },

    // Seat Map Operations
    seatMap: {
        getAll() {
            return JSON.parse(localStorage.getItem('tbs_seatMap') || '{}');
        },
        
        getJourney(journeyKey) {
            const seatMap = this.getAll();
            return seatMap[journeyKey] || [];
        },
        
        bookSeats(journeyKey, seats) {
            const seatMap = this.getAll();
            if (!seatMap[journeyKey]) {
                seatMap[journeyKey] = [];
            }
            seatMap[journeyKey].push(...seats);
            localStorage.setItem('tbs_seatMap', JSON.stringify(seatMap));
        },
        
        releaseSeats(journeyKey, seats) {
            const seatMap = this.getAll();
            if (seatMap[journeyKey]) {
                seatMap[journeyKey] = seatMap[journeyKey].filter(s => !seats.includes(s));
                localStorage.setItem('tbs_seatMap', JSON.stringify(seatMap));
            }
        }
    },

    // Session Management
    session: {
        set(user) {
            sessionStorage.setItem('tbs_currentUser', JSON.stringify(user));
        },
        
        get() {
            const user = sessionStorage.getItem('tbs_currentUser');
            return user ? JSON.parse(user) : null;
        },
        
        clear() {
            sessionStorage.removeItem('tbs_currentUser');
        }
    },

    // Clear all data (for testing)
    clearAll() {
        localStorage.removeItem('tbs_users');
        localStorage.removeItem('tbs_bookings');
        localStorage.removeItem('tbs_seatMap');
        sessionStorage.removeItem('tbs_currentUser');
        this.init();
    }
};

// Initialize database on load
DB.init();