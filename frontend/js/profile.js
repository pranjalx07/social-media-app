$("#updateProfile").click(function () {
    $.ajax({
        url: "/user/update-profile",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            userId: localStorage.getItem("userId"),
            address: $("#address").val()
        }),
        success: res => alert(res.message)
    });
});
