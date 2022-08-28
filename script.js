const DATABUKU = [];
const RENDER_EVENT = 'render-buku';
const SAVED_EVENT = 'saved-buku';
const STORAGE_KEY = 'BUKU_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBukuFromForm();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBukuFromForm(){
    const newID = +new Date();
    const bukuTitle = document.getElementById('inputBookTitle').value;
    const bukuAuthor = document.getElementById('inputBookAuthor').value;
    const bukuYear = document.getElementById('inputBookYear').value;
    const bukuIsRead = document.getElementById('inputBookIsRead').checked;

    const objectBuku = itemBuku(newID, bukuTitle, bukuAuthor, bukuYear, bukuIsRead);
    DATABUKU.push(objectBuku);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
}

function itemBuku(id, title, author, year, isRead){
    return {id, title, author, year, isRead}
}

document.addEventListener(RENDER_EVENT, function () {
    console.log(DATABUKU);
});

function makeBuku(objectBuku) {
    const setTitle = document.createElement('h3');
    setTitle.innerText = objectBuku.title;
    const setAuthor = document.createElement('p');
    setAuthor.innerText = "Penulis : " +  objectBuku.author;
    const setYear = document.createElement('p');
    setYear.innerText = "Tahun : " + objectBuku.year;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(setTitle, setAuthor, setYear);
    container.setAttribute('id', `buku-${objectBuku.id}`);

    if (objectBuku.isRead) {
        const unreadButton = document.createElement('button');
        unreadButton.classList.add('blue', 'unread-button');
        unreadButton.textContent = "Unread Book";

        unreadButton.addEventListener('click', function () {
            unreadBUKUFromRead(objectBuku.id);
        });
    
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.textContent = "Delete Book";

        deleteButton.setAttribute('onclick','removeConfirmation();' + onclick);
        var onclick = deleteButton.getAttribute("onclick");
        if (onclick){
            deleteButton.addEventListener('click', function () {
                removeBUKUFromRead(objectBuku.id);
            });
        }

        const textButton = document.createElement('div');
        textButton.classList.add('action');
        textButton.append(unreadButton, deleteButton);
    
        container.append(textButton);

    } else {
        const readButton = document.createElement('button');
        readButton.classList.add('green', 'unread-button');
        readButton.textContent = "Read Book";

        readButton.addEventListener('click', function () {
            readBUKUFromUnread(objectBuku.id);
        });
    
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.textContent = "Delete Book";

        deleteButton.setAttribute('onclick','removeConfirmation();' + onclick);
        var onclick = deleteButton.getAttribute("onclick");
        if (onclick){
            deleteButton.addEventListener('click', function () {
                removeBUKUFromUnread(objectBuku.id);
            });
        }

        const textButton = document.createElement('div');
        textButton.classList.add('action');
        textButton.append(readButton, deleteButton);
    
        container.append(textButton);

    }

    return container;
}

document.addEventListener(RENDER_EVENT, function () {
    const unreadBUKUList = document.getElementById('unreadBookList');
    unreadBUKUList.innerHTML = '';

    const readBUKUList = document.getElementById('readBookList');
    readBUKUList.innerHTML = '';

    for (const bukuItem of DATABUKU) {
        const bukuElement = makeBuku(bukuItem);
        unreadBUKUList.append(bukuElement);
        if (!bukuItem.isRead) {
            unreadBUKUList.append(bukuElement);
        } else {
            readBUKUList.append(bukuElement);
        }
    }
});

function addBUKUToRead(bukuId) {
    const targetBuku = findBUKU(bukuId);

    if (targetBuku == null) return;

    targetBuku.isRead = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
}

function findBUKU(bukuId) {
    for (const bukuItem of DATABUKU) {
        if (bukuItem.id === bukuId) {
        return bukuItem;
        }
    }
    return null;
}

function unreadBUKUFromRead(bukuId) {
    const targetBuku = findBUKU(bukuId);

    if (targetBuku == null) return;

    targetBuku.isRead = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
}

function removeBUKUFromRead(bukuId) {
    const targetBuku = findBukuIndex(bukuId);

    if (targetBuku === -1) return;

    DATABUKU.splice(targetBuku, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
}

function readBUKUFromUnread(bukuId) {
    const targetBuku = findBUKU(bukuId);

    if (targetBuku == null) return;

    targetBuku.isRead = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
}

function removeBUKUFromUnread(bukuId) {
    const targetBuku = findBukuIndex(bukuId);

    if (targetBuku === -1) return;

    DATABUKU.splice(targetBuku, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
}

function removeConfirmation(){
    confirm("Yakin untuk menghapus item buku ini?", function(result) {
        if(result) {
            return removeBUKUFromUnread();
        } else {
            result.preventDefault();
        }
    });
}

function findBukuIndex(bukuId) {
    for (const index in DATABUKU) {
        if (DATABUKU[index].id === bukuId) {
            return index;
        }
    }

    return -1;
}

function saveDataToStorage(){
    if (isStorageExist()) {
        const parsed = JSON.stringify(DATABUKU);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const buku of data) {
            DATABUKU.push(buku);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}
