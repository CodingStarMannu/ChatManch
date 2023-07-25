{
    //method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($('.delete-post-button', newPost));
                    new Noty({
                        theme: 'relax',
                        text: 'Post published',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show()
                    // window.location.reload();
                 }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    // method to create a Post in DOM

    let  newPostDom = function(post){
        return $(`<li id="${post._id}">
        <p>
             <small>
             <a class="delete-post-button" href="/posts/destroy/${post._id}">Delete</a>
            </small>
            ${post.content} 
            <br>
            <small>
                ${post.user.name}  
            </small>
        </p>
        <div class="post-comments">
        <form id="post-${ post._id }-comments-form" action="/comments/create" method="POST">
        <input type="text" name="content" placeholder="Write a comment..." required>
        <input type="hidden" name="post" value="${ post._id }">
        <input type="submit" value="Comment">
    </form>
            <div class="post-comments-list">
                <ul id="post-comments-${post._id}">
                </ul>
            </div>
        </div>
     </li>`)
    }

    //method to delete a post
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    console.log(data);
                    $(`#post-${data.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: 'Post Deleted!',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show()

                },error:function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    // let deletePost = function (deleteLink) {
    //     $(deleteLink).click(async function (e) {
    //         e.preventDefault();
    
    //         try {
    //             const response = await $.ajax({
    //                 type: 'get',
    //                 url: $(this).prop('href'),
    //             });
    
    //             console.log(response);
    //             $(`#post-${response.data.post_id}`).remove();
    //         } catch (error) {
    //             console.log(error.responseText);
    //         }
    //     });
    // }
    

    createPost();
}