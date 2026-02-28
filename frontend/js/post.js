function loadPosts() {
    $.get("/posts", function (res) {
        $("#feed").html("");
        res.posts.forEach(p => {
            $("#feed").append(`
                <div class="card mt-2 p-2">
                  <b>${p.username}</b>
                  <p>${p.content}</p>
                  👍 ${p.likes} 👎 ${p.dislikes}
                  <button onclick="like(${p.id})">Like</button>
                  <button onclick="dislike(${p.id})">Dislike</button>
                </div>
            `);
        });
    });
}

$("#postBtn").click(function () {
    $.ajax({
        url: "/posts/create",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            userId: localStorage.getItem("userId"),
            content: $("#postContent").val()
        }),
        success: loadPosts
    });
});

function like(id) {
    $.post("/posts/like", { postId: id }, loadPosts);
}
function dislike(id) {
    $.post("/posts/dislike", { postId: id }, loadPosts);
}

loadPosts();
