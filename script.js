document.addEventListener('DOMContentLoaded', function () {
    getData();
});

let editingId = null;

async function getData() {
    try {
        const response = await fetch('https://ap-iwith-mongo-db.vercel.app/api/products');
        const data = await response.json();

        console.log('All data retrieved:', data);
        displayData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// function displayData(data) {
//     const tableBody = document.querySelector('#dataTable tbody');
//     tableBody.innerHTML = '';

//     data.forEach(item => {
//         const row = tableBody.insertRow();
//         row.innerHTML = `<td>${item._id}</td><td>${item.title}</td><td>${item.price}</td>
//             <td>
//                 <button class="btn btn-warning btn-sm" onclick="editData('${item._id}')">Edit</button>
//                 <button class="btn btn-danger btn-sm" onclick="deleteData('${item._id}')">Delete</button>
//             </td>`;
//     });
// }

function displayData(data) {
    const cardContainer = document.querySelector('#cardContainer');
    cardContainer.innerHTML = '';

    data.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">Price: $${item.price}</p>
                <button class="btn btn-warning btn-sm" onclick="editData('${item._id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteData('${item._id}')">Delete</button>
            </div>
        `;

        cardContainer.appendChild(card);
    });
}


async function editData(id) {
    const response = await fetch(`https://ap-iwith-mongo-db.vercel.app/api/products/${id}`);
    const data = await response.json();

    // Populate the modal fields
    document.getElementById('editTitleInput').value = data.title;
    document.getElementById('editPriceInput').value = data.price;

    // Store the editing ID for saving changes
    editingId = id;

    // Open the modal
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
        // If editing, perform PUT request to update data
        const response = await fetch(`https://ap-iwith-mongo-db.vercel.app/api/products/${editingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, price }),
        });

        handleResponse(response, 'Data updated successfully!', 'Failed to update data.');

        // Reset editingId and close the modal after saving changes
        editingId = null;
        $('#editModal').modal('hide');
    } else {
        // If not editing, perform POST request to add new data
        const response = await fetch('https://ap-iwith-mongo-db.vercel.app/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, price }),
        });

        handleResponse(response, 'Data added successfully!', 'Failed to add data.');
    }

    // Clear form after adding or updating data
    clearForm();
}

async function deleteData(id) {
    const confirmDelete = confirm('Are you sure you want to delete this record?');

    if (confirmDelete) {
        const response = await fetch(`https://ap-iwith-mongo-db.vercel.app/api/products/${id}`, {
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

        // Refresh data after successful operation
        getData();
    } else {
        responseMessage.textContent = errorMessage;
        responseMessage.style.color = 'red';
    }
}

function clearForm() {
    // Clear form fields
    document.getElementById('titleInput').value = '';
    document.getElementById('priceInput').value = '';

    // Reset editingId and button text
    editingId = null;
}
function saveChanges() {
    // Implement the logic to save changes in the edit modal
    // You can reuse the logic from the addData function with some modifications
    const title = document.getElementById('editTitleInput').value;
    const price = document.getElementById('editPriceInput').value;

    if (!title || !price) {
        alert('Please enter both title and price.');
        return;
    }

    if (editingId) {
        // If editing, perform PUT request to update data
        fetch(`https://ap-iwith-mongo-db.vercel.app/api/products/${editingId}`, {
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
                // Close the edit modal after saving changes
                $('#editModal').modal('hide');
                // Clear the editingId after successful update
                editingId = null;
            })
            .catch(error => {
                console.error('Error updating data:', error);
                handleResponse(null, null, 'Failed to update data.');
            });
    }
}
