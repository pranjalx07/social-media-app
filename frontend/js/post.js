function loadPosts() {
  $.get("/posts", function (res) {
    $("#feed").html("");
    res.posts.forEach((p) => {
      $("#feed").append(`
                <div class="card mt-2 p-2">
                  <b>${p.username}</b>
                  <p>${p.content}</p>
                  👍 ${p.likes} 👎 ${p.dislikes}
                  <button onclick="like(${p.id})">Like</button>
                  <button onclick="dislike(${p.id})">Dislike</button>
                </div>
                <div class="mt-3">

    <div class="d-flex gap-2">

        <input
            type="text"
            id="comment-${p.id}"
            class="form-control"
            placeholder="Write a comment...">

        <button
            onclick="addComment(${p.id})"
            class="btn btn-primary">
            Comment
        </button>

    </div>
    <div id="comments-${p.id}" class="mt-3"></div>

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
      content: $("#postContent").val(),
    }),
    success: function (res) {
    //   localStorage.setItem("userId", res.user.id);

      window.location.href = "feed.html";
    },
  });
});

function like(id) {
  $.post("/posts/like", { postId: id }, loadPosts);
}
function dislike(id) {
  $.post("/posts/dislike", { postId: id }, loadPosts);
}

loadPosts();
function addComment(postId){

    $.ajax({

        url: "/posts/comment",

        type: "POST",

        contentType: "application/json",

        data: JSON.stringify({

            postId: postId,

            userId: localStorage.getItem("userId"),

            comment: $(`#comment-${postId}`).val()
        }),
    success : function(){
      $(`#comment-${postId}`).val("");

loadComments(postId);
    }
      
    });
}
function loadComments(postId){

    $.get(`/posts/comments/${postId}`,

        function(res){

            let html = "";

            res.comments.forEach(c => {

                html += `

                    <div class="bg-light rounded p-2 mb-2">

                        <b>${c.username}</b>

                        <div>
                            ${c.comment}
                        </div>

                    </div>
                `;
            });

            $(`#comments-${postId}`).html(html);
        }
    );

}