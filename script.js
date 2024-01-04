document.addEventListener('DOMContentLoaded', function () {
    getData();
});

let editingId = null;

let dataFetched = false;

async function getData() {
    if (dataFetched) {
        console.log('Data already fetched. Skipping...');
        return;
    }

    try {
        const response = await fetch('https://restful-ap-iwith-mongo-db-i6rh.vercel.app/api/products');
        const data = await response.json();

        console.log('All data retrieved:', data);
        displayData(data);
        dataFetched = true;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function displayData(data) {
    const container = document.querySelector('.container');
   // container.innerHTML = ''; // Clear existing content

    for (let i = 0; i < data.length; i += 4) {
        const row = document.createElement('div');
        row.classList.add('row');

        for (let j = i; j < i + 4 && j < data.length; j++) {
            const item = data[j];

            const col = document.createElement('div');
            col.classList.add('col-md-3', 'mb-4');

            const card = document.createElement('div');
            card.classList.add('card');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            cardBody.innerHTML = `<h5 class="card-title">${item.title}</h5>
                <p class="card-text">Price: ${item.price}</p>
                <button class="btn btn-warning btn-sm" onclick="editData('${item._id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteData('${item._id}')">Delete</button>`;

            card.appendChild(cardBody);
            col.appendChild(card);
            row.appendChild(col);
        }

        container.appendChild(row);
    }
}




async function editData(id) {
    const response = await fetch(`https://restful-ap-iwith-mongo-db-i6rh.vercel.app/api/products/${id}`);
    const data = await response.json();

    document.getElementById('editTitleInput').value = data.title;
    document.getElementById('editPriceInput').value = data.price;

    editingId = id;

    $('#editModal').modal('show');
}

async function addData() {
    const title = document.getElementById('titleInput').value;
    const price = document.getElementById('priceInput').value;

    if (!title || !price) {
        alert('Please enter both title and price.');
        return;
    }

    if (editingId) {
        const response = await fetch(`https://restful-ap-iwith-mongo-db-i6rh.vercel.app/api/products/${editingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, price }),
        });

        handleResponse(response, 'Data updated successfully!', 'Failed to update data.');

        editingId = null;
        $('#editModal').modal('hide');
    } else {
        const response = await fetch('https://restful-ap-iwith-mongo-db-i6rh.vercel.app/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, price }),
        });

        handleResponse(response, 'Data added successfully!', 'Failed to add data.');
    }

    clearForm();
}

async function deleteData(id) {
    const confirmDelete = confirm('Are you sure you want to delete this record?');

    if (confirmDelete) {
        const response = await fetch(`https://restful-ap-iwith-mongo-db-i6rh.vercel.app/api/products/${id}`, {
            method: 'DELETE',
        });

        handleResponse(response, 'Data deleted successfully!', 'Failed to delete data.');
    }
}

function handleResponse(response, successMessage, errorMessage) {
    const responseMessage = document.getElementById('responseMessage');

    if (response.ok) {
        responseMessage.textContent = successMessage;
        responseMessage.style.color = 'green';

        getData();
    } else {
        responseMessage.textContent = errorMessage;
        responseMessage.style.color = 'red';
    }
}

function clearForm() {
    document.getElementById('titleInput').value = '';
    document.getElementById('priceInput').value = '';

    editingId = null;
}
function saveChanges() {
    const title = document.getElementById('editTitleInput').value;
    const price = document.getElementById('editPriceInput').value;

    if (!title || !price) {
        alert('Please enter both title and price.');
        return;
    }

    if (editingId) {
        fetch(`https://restful-ap-iwith-mongo-db-i6rh.vercel.app/api/products/${editingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, price }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data updated successfully:', data);
                handleResponse(data, 'Data updated successfully!', null);
                $('#editModal').modal('hide');
                editingId = null;
            })
            .catch(error => {
                console.error('Error updating data:', error);
                handleResponse(null, null, 'Failed to update data.');
            });
    }
}
