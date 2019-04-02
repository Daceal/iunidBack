// =======================================
// COMPANY OPTIONS
// =======================================

app.get('/Company/searchContacts', (req, res) => {
    res.json({
        ok: true,
        message: 'This is the search contacts page'
    });
});

app.get('/Company/myBills', (req, res) => {
    res.json({
        ok: true,
        message: 'This is the my bills page'
    });
});

app.get('/Company/workingRoom', (req, res) => {
    res.json({
        ok: true,
        message: 'This is the working room page'
    });
});

app.get('/Company/help', (req, res) => {
    res.json({
        ok: true,
        message: 'This is the help page'
    });
});

app.get('/Company/dashboard', (req, res) => {
    res.json({
        ok: true,
        message: 'This is the dashboard page'
    });
});

app.get('/Company/profile', (req, res) => {
    res.json({
        ok: true,
        message: 'This is the profile page'
    });
});