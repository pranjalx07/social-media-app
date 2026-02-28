// Admin Login
$("#adminLoginBtn").click(function () {
    $.ajax({
        url: "/admin/adminlogin",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            username: $("#adminUsername").val(),
            password: $("#adminPassword").val()
        }),
        success: function (res) {
            if (res.success) {
                alert(res.message);
                $("#adminLoginSection").hide();
                $("#adminDashboard").show();
                loadPendingUsers();
            }
        },
        error: function (err) {
            alert(err.responseJSON?.message || "Login failed");
        }
    });
});

// Load Pending Users
function loadPendingUsers() {
    $.ajax({
        url: "/admin/pending-users",
        type: "GET",
        success: function (res) {
            if (res.success) {
                displayUsers(res.users);
            }
        },
        error: function () {
            $("#pendingUsers").html("<p class='text-danger'>Failed to load users</p>");
        }
    });
}

// Display Users
function displayUsers(users) {
    if (users.length === 0) {
        $("#pendingUsers").html("<p class='text-muted'>No pending users</p>");
        return;
    }

    let html = "";
    users.forEach(user => {
        html += `
            <div class="card p-3 mb-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${user.username}</strong> (${user.email})<br>
                        <small>Gender: ${user.gender} | Address: ${user.address}</small>
                    </div>
                    <div>
                        <button class="btn btn-success btn-sm me-2" onclick="updateUserStatus(${user.id}, 'approve')">Approve</button>
                        <button class="btn btn-danger btn-sm" onclick="updateUserStatus(${user.id}, 'reject')">Reject</button>
                    </div>
                </div>
            </div>
        `;
    });
    $("#pendingUsers").html(html);
}

// Update User Status
function updateUserStatus(userId, action) {
    $.ajax({
        url: "/admin/update-user-status",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            userId: userId,
            action: action
        }),
        success: function (res) {
            alert(res.message);
            loadPendingUsers();
        },
        error: function (err) {
            alert(err.responseJSON?.message || "Action failed");
        }
    });
}

// Logout
function logout() {
    $("#adminDashboard").hide();
    $("#adminLoginSection").show();
    $("#adminUsername").val("");
    $("#adminPassword").val("");
}
