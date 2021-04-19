//Rsearch on document.querySelector
var tnum = 0;
let updateId;
//Add Rider Modal
const btnAdd = document.querySelector('.btn-add');
const addModal = document.querySelector('.add-modal');

//Update Rider MOdal
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form')

const tableRiders = document.querySelector('.table-riders');
const addModalForm = document.querySelector('.add-modal, .form');
const dataref = firebase.database().ref('riders');





window.onload = function () {
    readAllRiders();
}


//this means when the add rider button is clicked it should call the css class modal-show whci should then display the modal class 
btnAdd.addEventListener('click', () => {
    addModal.classList.add('modal-show');// modal show class is found in the css file
});


//this means when the user clicks anywhere in the window it 
// should dismiss the modal view, when the user clicks on the modal itself it wont 
// dismiss
window.addEventListener('click', e => {
    if (e.target == addModal) {
        addModal.classList.remove('modal-show');
    }

    if (e.target == editModal) {
        editModal.classList.remove('modal-show');
    }
});


//GET ALL RIDERS 
function readAllRiders() {
    firebase.database().ref('riders').once('value',
        function (snapshot) {
            snapshot.forEach(
                function (data) {
                    var name = data.val().rider_name;
                    var email = data.val().rider_email;
                    var address = data.val().rider_address;
                    var phone = data.val().rider_phone;
                    var rId = data.val().rider_id;
                    echoRiders(name, email, address, phone, rId);
                    $('#dt-rider').DataTable();
                }
            )

        }
    )
}
 

function echoRiders(name, email, address, phone, id) {
    const trow = `
        <tr data-id='${id}' id='${id}'>
            <td id='td-name-${id}'>${name}</td>
            <td id='td-email-${id}'>${email}</td>
            <td id='td-address-${id}'>${address}</td>
            <td id='td-phone-${id}'>${phone}</td>
            <td>
                <button class="btn btn-edit">Edit</button>
                <button class="btn btn-delete">Delete</button>
            </td>
        </tr>
    `;
    tableRiders.insertAdjacentHTML('beforeend', trow);



    //click delete button
    const delbtn = document.querySelector(`[data-id='${id}'] .btn-delete`);
    delbtn.addEventListener('click', () => {
        document.getElementById(id).style.display = 'none';
        firebase.database().ref('riders').child(id).remove().then(() => {
            console.log('rider sucessfully delted');
        }).catch(err => {
            console.log('error removing rider' + err);
            document.getElementById(id).style.display = 'block';
        });


    });


    //Click Edit Button
    const editBtn = document.querySelector(`[data-id='${id}'] .btn-edit`)
    editBtn.addEventListener('click', () => {
        editModal.classList.add('modal-show');
        updateId = id;
        //grabinig the values from each table data and passing them into the textbox
        editModalForm.fullName.value = document.getElementById('td-name-' + id).innerText.trim();
        editModalForm.phone.value = document.getElementById('td-phone-' + id).innerText.trim();
        editModalForm.email.value = document.getElementById('td-email-' + id).innerText.trim();
        editModalForm.address.value = document.getElementById('td-address-' + id).innerText.trim();
    });


}


function updateUi() {
    document.getElementById('fullName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('address').value = '';
    document.getElementById('phone').value = '';
}


//setting click listener on submit button in add Modal Form
addModalForm.addEventListener('submit', e => {
    e.preventDefault(); //this code ensures that the page does not reload anytime we click the submit button.
    var fname = document.getElementById('fullName').value;
    var email = document.getElementById('email').value;
    var address = document.getElementById('address').value;
    var phone = document.getElementById('phone').value;
    var timestand = new Date().getTime();
    var id = timestand;

    dataref.child(id).set({
        rider_name: fname,
        rider_email: email,
        rider_address: address,
        rider_phone: phone,
        rider_id: id
    });
    echoRiders(fname, email, address, phone);
    updateUi();
    editModal.classList.remove('modal-show');

});















//Setting Clicklistener on Update Button in edit Modal Form
editModalForm.addEventListener('submit', e => {
    e.preventDefault();
    var gname = editModalForm.fullName.value;
    var gemail = editModalForm.email.value;
    var gaddress = editModalForm.address.value;
    var gphone = editModalForm.phone.value;

    firebase.database().ref('riders').child(updateId).update({
        rider_name: gname,
        rider_email: gemail,
        rider_address: gaddress,
        rider_phone: gphone,
    });

    document.getElementById("td-name-" + updateId + "").innerHTML = gname;
    document.getElementById("td-phone-" + updateId + "").innerHTML = gphone;
    document.getElementById("td-address-" + updateId + "").innerHTML = gaddress;
    document.getElementById("td-email-" + updateId + "").innerHTML = gemail;

    editModal.classList.remove('modal-show');
});








