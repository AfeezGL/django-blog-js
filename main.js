const container = document.querySelector(".container")
const createButton = document.querySelector('#create-article')
const forms = document.querySelector('.forms')
const loginForm = document.querySelector('#login-form')
const createArticleForm = document.querySelector('.create-article-form')
const articleSubmitButton = document.querySelector('#articleSubmit')
var isAuthenticated = localStorage.getItem('isAuthenticated')
var authToken = window.localStorage.getItem('authToken')
console.log(isAuthenticated)


if (isAuthenticated == "true"){
    createArticleForm.style.display = "flex"
    loginForm.style.display = "none"
}else {
    createArticleForm.style.display = "none"
    loginForm.style.display = "flex"
}

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
    if (isAuthenticated == "true"){
        createArticleForm.style.display = "flex"
        loginForm.style.display = "none"
    }else {
        createArticleForm.style.display = "none"
        loginForm.style.display = "flex"
    }
    forms.scrollIntoView()
})


// LOGIN
loginForm.addEventListener('submit', function(e){
    e.preventDefault()
    
    let formData = new FormData(this)

    fetch("https://prj-django-blog.herokuapp.com/api/login", {
        method: "POST",
        body: formData
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

// CREATE ARTICLE
createArticleForm.addEventListener('submit', function(e){
    e.preventDefault()
    let formData = new FormData(this)

    fetch("https://prj-django-blog.herokuapp.com/api/articles/", {
        method: "POST",
        headers: {
            "Authorization": `Token ${authToken}`,
        },
        body: formData
    })
    .then(res => res.json())
    .then((data) => {
        console.log(data)
        if (data.detail || data.detail == "Invalid token."){
            loginForm.style.display = "flex"
            alert("please login")
        }
    })
    .catch((error) => alert(error.message))
})