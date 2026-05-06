$("#loginBtn").click(function () {
    $.ajax({
        url: "/auth/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            username: $("#username").val(),
            password: $("#password").val()
        }),
        success: function (res) {
            alert(res.message);
            localStorage.setItem("userId", res.user.id);
            
            // Redirect based on user role
            if (res.isAdmin) {
                window.location.href = "admin.html";
            } else {
                window.location.href = "feed.html";
            }
        },
        error: function (err) {
            alert(err.responseJSON.message);
        }
    });
});

$("#registerForm").submit(function (e) {
    e.preventDefault();

    const userData = {
        username: $("#username").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        confirmpassword: $("#confirm_password").val(), //added confirm password
        address: $("#address").val(),
        gender: $("#gender").val()
    };

    $.ajax({
        url: "/auth/register",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(userData),
        success: function (response) {
            if (response.success) {
                $("#message").html("<p style='color:green'>" + response.message + "</p>");
                $("#registerForm")[0].reset();
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else {
                $("#message").html("<p style='color:red'>" + response.message + "</p>");
            }
        },
        error: function () {
            $("#message").html("<p style='color:red'>Server error</p>");
        }
    });
});

