const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const submitBtn = document.getElementById('submit');
const blist = document.getElementById('list');
const form = document.getElementById('Blog');


form.addEventListener('submit', (event) => {
  event.preventDefault();
  validation();
});




function Display(){

    const titleValue = titleInput.value;
    const contentValue = contentInput.value;


    if (!titleValue || !contentValue){
        alert('Please Input all fileds!');
        return;
    }

    const newLi = document.createElement('li');
    newLi.classList.add('blog-post');
    const newId = Date.now();
    newLi.setAttribute("data-id", newId);


    newLi.innerHTML = `<h2><div class="t">${titleValue}</div></h2>
                        <span class="c">${contentValue}</span>
                        <button class="editBtn">Edit</button>
                        <button class="delBtn">Delete</button>`

    blist.appendChild(newLi);

    saveToLocalStorage();


}

blist.addEventListener('click', (event) => {
        if (event.target.classList.contains('editBtn')) {
            editBlog(event);
        }

         if (event.target.classList.contains('delBtn')) {
            delBlog(event);
        }
});

let editingPostId = null;

function editBlog(event){
    const b = event.target.closest('li');
    const id = b.getAttribute("data-id");
    editingPostId = id;

    const currentTitle = b.querySelector('.t').textContent;
    const currentContent = b.querySelector('.c').textContent;

    titleInput.value = currentTitle;
    contentInput.value = currentContent;
}


function delBlog(event){
    const b = event.target.closest('li');
    b.remove();
    saveToLocalStorage();

}

function validation(){
    const t = validateTitle();
    const c = validateContent();

    const isValid = t && c;
    if (isValid){
        if (editingPostId) {
            // update existing blog
            const postLi = blist.querySelector(`[data-id="${editingPostId}"]`);
            postLi.querySelector('.t').textContent = titleInput.value;
            postLi.querySelector('.c').textContent = contentInput.value;

            alert("Blog successfully updated");

            editingPostId = null; // reset back to normal
        } else {
            // create new blog
            Display();
            alert("Blog successfully uploaded");
        }

        form.reset();
    }
}

function validateTitle() {
  if (titleInput.value.trim() === "") {
    document.getElementById('titleError').textContent = "Title is required.";
    return false;
//   } else if (titleInput.value.length < 3) {
//     document.getElementById('titleError').textContent = "Title must be at least 3 characters.";
//     return false;
  } else {
    document.getElementById('titleError').textContent = "";
    return true;
  }

}

function validateContent() {
  if (contentInput.value.trim() === "") {
    document.getElementById('contentError').textContent = "Content is required.";
    return false;
//   } else if (titleInput.value.length < 3) {
//     document.getElementById('titleError').textContent = "Title must be at least 3 characters.";
//     return false;
  } else {
    document.getElementById('contentError').textContent = "";
    return true;
  }

}



function saveToLocalStorage() {
    const posts = [];
    blist.querySelectorAll('li').forEach(li => {
        posts.push({
            id: li.getAttribute("data-id"),
            title: li.querySelector('.t').textContent,
            content: li.querySelector('.c').textContent
        });
    });
    localStorage.setItem("blogs", JSON.stringify(posts));
}

function loadFromLocalStorage() {
    const savedPosts = JSON.parse(localStorage.getItem("blogs")) || [];
    savedPosts.forEach(post => {
        const newLi = document.createElement('li');
        newLi.classList.add('blog-post');
        newLi.setAttribute("data-id", post.id);

        newLi.innerHTML = 
            `<h2><div class="t">${post.title}</div></h2>
            <span class="c">${post.content}</span>
            <button class="editBtn">Edit</button>
            <button class="delBtn">Delete</button>`;

        blist.appendChild(newLi);
    });
}

window.onload = loadFromLocalStorage;