const container = document.querySelector(".container")
fetch ("https://prj-django-blog.herokuapp.com/api/articles/",
{headers: {
    "Content-Type": "application/json",
}})
.then(res => res.json())
.then((posts) => {
    console.log(posts)
    posts.forEach(post => {
        let article = `<article>
                            <image src = "${post.image}">
                            <h4>${post.title}</h4>
                            <p>${post.short_text}
                        </article>`
        container.innerHTML += article;
    });
})