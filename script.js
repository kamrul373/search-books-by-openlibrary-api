// fetching openlibrary api using search input value dynamically
const search = () => {
    const searchField = document.getElementById("search-field").value;
    // validation before fetching
    if (searchField === "") {
        document.getElementById("error").style.display = "block";
        document.getElementById("books").innerHTML = "";
        document.getElementById("error").innerHTML = "<h2 class='text-center  text-warning'>Please provide a book name</h2>";
    } else {
        document.getElementById("loading").style.display = "block";
        document.getElementById("error").style.display = "none";
        fetch(`https://openlibrary.org/search.json?title=${searchField}&limit=50`)
            .then(response => response.json())
            .then(books => displayBooks(books.docs));
    }

}
// displaying books frontend from fetching information
const displayBooks = (books) => {
    books = books.slice(0, 20);
    document.getElementById("loading").style.display = "none";
    const booksContainer = document.getElementById("books");
    booksContainer.innerHTML = "";
    booksContainer.innerHTML += `<div class=col-md-12><h2 class="text-center">Found ${books.length} books</h2></div>`;
    books.forEach(book => {
        const { title, author_name, author_key, cover_i, first_publish_year, publish_place, publisher } = book;
        // destructuring
        const column = document.createElement("div");
        column.classList.add("col");
        const imgUrl = `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`;

        column.innerHTML = `
        
        <div class="card">
            <img src="${imgUrl}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">Author : ${author_name[0]} </p>
                <p class="card-text">Published : ${first_publish_year} in ${publish_place ? publish_place[0] : "n/a"}</p>
                <p>Publishers : ${publisher ? publisher[0] : "n/a"}</p>
                <button class="btn btn-success" onclick="loadauthorInfo('${author_key[0]}')" data-bs-toggle="modal" data-bs-target="#exampleModal">Details of Author</button>
            </div>
        </div>
        `

        booksContainer.appendChild(column);

    });
}
// loading author infoormation
const loadauthorInfo = authorKey => {
    const authorInfoUrl = `https://openlibrary.org/authors/${authorKey}.json`;
    fetch(authorInfoUrl)
        .then(response => response.json())
        .then(authorData => displayAuthor(authorData));
}
// displaying autor information in modal
const displayAuthor = authorData => {
    const { name, birth_date, photos, remote_ids, bio } = authorData;
    let authorImg = "";
    if (photos) {
        const authorImgUrl = `https://covers.openlibrary.org/a/id/${photos[0]}-S.jpg`;
        authorImg = `<img src="${authorImgUrl}" />`
    }

    const authorContainer = document.getElementById("author-details");
    authorContainer.innerHTML = "";
    authorContainer.innerHTML = `
    <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel"> ${authorImg} ${name}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
       <p><strong>Birth Date : </strong> ${birth_date ? birth_date : "n/a"}</p>
       <p><strong>Wiki : </strong> <a href="https://www.wikidata.org/wiki/${remote_ids ? remote_ids.wikidata : 'n/a'}">${name}</a> </p>
       <p>Bio : ${bio ? bio.value : "n/a"} </p>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>
    `
}