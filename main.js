const header = document.querySelector('header')
const nav = document.querySelector('nav')
const container = document.querySelector(".container")
const createButton = document.querySelector('#create-article')
const forms = document.querySelector('.forms')
const loginForm = document.querySelector('#login-form')
const createArticleForm = document.querySelector('.create-article-form')
const articleSubmitButton = document.querySelector('#articleSubmit')
const loginBtn = `<button onclick="openLoginForm()"><i class="fas fa-sign-in-alt"></i>login</button>`
const logoutBtn = `<button onclick="logout()"><i class="fas fa-sign-out-alt"></i>Logout</button>`
const baseUrl = "https://prj-django-blog.herokuapp.com/api/articles/"
var nextUrl = ""
var prevUrl = ""
var isAuthenticated = localStorage.getItem('isAuthenticated')
var authToken = window.localStorage.getItem('authToken')
console.log(isAuthenticated)



if (isAuthenticated == "true"){
    createArticleForm.style.display = "flex";
    loginForm.style.display = "none";
    nav.innerHTML += logoutBtn;
}else {
    createArticleForm.style.display = "none";
    loginForm.style.display = "flex";
    nav.innerHTML += loginBtn;
};



window.onload = fetchArticles(baseUrl);



// Fetch articles
function fetchArticles(url){
    fetch (url,
        {headers: {
            "Content-Type": "application/json",
        }})
        .then(res => res.json())
        .then((res) => {
            container.innerHTML = "";
            res.results.forEach(post => {
                let article = `<article>
                                    <image src = "${post.image}">
                                    <h4>${post.title}</h4>
                                    <p>${post.short_text}...</p>
                                </article>`;
                container.innerHTML += article;
            })
            if (res.next != null){
                nextUrl = res.next;
                let nextBtn = `<button class = "btn" onclick = "fetchArticles(nextUrl)" >Next</button>`;
                container.innerHTML += nextBtn;
            } else if (res.previous != null){
                prevUrl = res.previous;
                let prevBtn = `<button class = "btn" onclick = "fetchArticles(prevUrl)">Prev</button>`;
                container.innerHTML += prevBtn;
        }
        header.scrollIntoView();
    });
};



// Focus article creation form into view when the create button is clicked
// Or
// Display the login form if user is not logged in
createButton.addEventListener( 'click', function(){
    if (isAuthenticated == "true"){
        createArticleForm.style.display = "flex";
        loginForm.style.display = "none";
    }else {
        createArticleForm.style.display = "none";
        loginForm.style.display = "flex";
    };
    forms.scrollIntoView();
});



// Display the login form when the login button is clicked
function openLoginForm(){
    loginForm.style.display = "flex";
};



// LOGIN and obtain authentication token from the backend then save it in the local storage
// Also set isAuthenticated to true and save the aut status to localstorage
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



// Logout the user and clear the localstorage
function logout(){
    fetch('https://prj-django-blog.herokuapp.com/api/logout/', {
        method: "POST",
        headers: {
            "Authorization": `Token ${authToken}`,
        },
        body: "logout"
    })
    .then(res => res.json())
    .then(
        window.localStorage.clear()
    )
};



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
        //ask user to login if token is invalid
        if (data.detail || data.detail == "Invalid token."){
            loginForm.style.display = "flex"
            alert("please login")
        }
    })
    .catch((error) => alert(error.message))
});