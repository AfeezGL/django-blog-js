const container = document.querySelector(".container")
const createButton = document.querySelector('#create-article')
const loginForm = document.querySelector('.login-form')
const createArticleForm = document.querySelector('.create-article-form')
var isAuthenticated = false
var authToken = ""

createButton.addEventListener( 'click', function(){
    container.innerHTML = ""
    if (isAuthenticated){
        createArticleForm.style.display = "flex"
    }else {
        loginForm.style.display = "flex"
    }
})

const loginButton = document.querySelector('#loginSubmit')
loginButton.addEventListener('click', function(e){
    e.preventDefault()
    let username = document.querySelector('#username').value
    let password = document.querySelector('#password').value

    fetch("https://prj-django-blog/api/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    .then(res => res.json())
    .then((data) => {
        console.log(data)
        if (data.token){
            isAuthenticated = true
            authToken = data.token
            loginForm.style.display = "none"
            createArticleForm.style.display = "flex"
        }else {
            alert(data)
        }
    })
    .catch((error) => alert(error))
})

fetch ("https://prj-django-blog/api/articles/",
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
                            <p>${post.short_text}...</p>
                        </article>`
        container.innerHTML += article;
    });
})