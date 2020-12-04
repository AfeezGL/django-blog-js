const container = document.querySelector(".container")
const createButton = document.querySelector('#create-article')
const loginForm = document.querySelector('.login-form')
const createArticleForm = document.querySelector('.create-article-form')
const articleSubmitButton = document.querySelector('#articleSubmit')
var isAuthenticated = localStorage.getItem('isAuthenticated')
var authToken = window.localStorage.getItem('authToken')
console.log(isAuthenticated)

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
                            <p>${post.short_text}...</p>
                        </article>`
        container.innerHTML += article;
    });
})

createButton.addEventListener( 'click', function(){
    container.innerHTML = ""
    if (isAuthenticated == "true"){
        createArticleForm.style.display = "flex"
        loginForm.style.display = "none"
    }else {
        createArticleForm.style.display = "none"
        loginForm.style.display = "flex"
    }
})

const loginButton = document.querySelector('#loginSubmit')
loginButton.addEventListener('click', function(e){
    e.preventDefault()
    let username = document.querySelector('#username').value
    let password = document.querySelector('#password').value

    fetch("https://prj-django-blog.herokuapp.com/api/login", {
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
            let Authenticated = true
            window.localStorage.setItem('isAuthenticated', Authenticated)
            let Token = data.token
            window.localStorage.setItem('authToken', Token)
            loginForm.style.display = "none"
            createArticleForm.style.display = "flex"
        }else {
            alert(data.non_field_errors[0])
        }
    })
    .catch((error) => alert(error.message))
})

articleSubmitButton.addEventListener('click', function(e){
    e.preventDefault()
    let image = document.querySelector('#image').value
    let title = document.querySelector('#title').value
    let articleBody = document.querySelector('#articleBody').value

    fetch("https://prj-django-blog.herokuapp.com/api/articles/", {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",
            "Authentication": `Token ${authToken}`,
            "Origin": "https://afeezgl.github.io"
        },
        body: JSON.stringify({
            "image": image,
            "title": title,
            "body": articleBody
        })
    })
    .then(res => res.json())
    .then((data) => console.log(data))
    .catch((error) => alert(error.message))
})