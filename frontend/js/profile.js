console.log("profilePic element:", document.getElementById("profilePic"));
$(document).ready(function () {

$("#updateProfile").click(function () {
    const formData = new FormData();
    formData.append("userId", localStorage.getItem("userId"));
    formData.append("address",$("#address").val());
    formData.append("bio",$("#bio").val());
    formData.append("oldPassword",$("#oldPassword").val());
    formData.append("newPassword",$("#newPassword").val());
    const file = $("#profilepic")[0].files[0];
    if(file){
        formData.append("profilePic", file);
    }
$.ajax({
        url: "http://localhost:3000/user/update-profile",
        type: "POST",
        contentType: false,
        processData: false,
        data: formData,
        success: function (res) {
            alert(res.message);
        },
        error: function (err) {
            alert(err.responseJSON?.message || "Profile update failed");
        }
    });
});
});
