let btnS = document.querySelectorAll('.btn-success');
btnS.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let id = e.target.parentNode.parentNode.id;
        appendPicture(id)
    })
});


let btnD = document.querySelectorAll('.btn-danger');
btnD.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let id = e.target.parentNode.parentNode.id;
        DeletePicture(id);
    })
});

async function DeletePicture(id) {
    const response = await fetch("/picture/delete/" + id, {
        method: "DELETE",
    });
    if (response.ok === true) {
        document.getElementById(id).remove();
    } else {
        console.log('чот пошло не так')
    }
}
async function appendPicture(id) {

    let descr=document.querySelector('[data-id="'+`${id}`+'"]').value;
    let formData = new FormData();
    formData.append('descr',descr);
    console.log(descr);
    const response = await fetch("/picture/append/" + id, {
        method: "PUT",
        body:formData
    });
    if (response.ok === true) {
        document.getElementById(id).remove();

    } else {
        console.log('чот пошло не так')
    }
};

let hideAdmin = function () {
        if (!localStorage.getItem('isAdmin')) {
            document.getElementById('admin').remove()
        };
}
let hideLogin = function () {
    let key = localStorage.getItem('isAdmin')
    if (Boolean(key) === true){
            console.log('kek');            
            document.getElementById('login').remove();
        } 
}
hideLogin();
hideAdmin();