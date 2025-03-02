let data = []; // Array to store the data
const tableBody = document.querySelector("#dataTable tbody");

// Event listener for file input change
document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
        const reader = new FileReader(); // Create a FileReader to read the file
        reader.onload = function (e) {
            const content = e.target.result; // File content

            // Split content into rows
            const rows = content.split("\n");

            // Extract the headers (first row)
            const headers = rows[0].split(",");

            // Clear previous data
            data = [];

            // Loop through each row after the headers
            for (let i = 1; i < rows.length; i++) {
                const values = rows[i].split(",");
                const obj = {};

                // Map values to their headers
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = values[j];
                }

                data.push(obj); // Add the object to the data array
            }

            renderTable(); // Render the table with the new data
        };

        reader.readAsText(file); // Read the file as text
    } else {
        console.error("No file selected!"); // Error handling
    }
});


// Function to render the table
// function renderTable() {
//     tableBody.innerHTML = ""; // Clear existing rows

//     for (let i = 0; i < data.length; i++) {
//         const row = data[i];
//         const tr = document.createElement("tr");

//         // Add cells for each value in the row
//         for (let key in row) {
//             const td = document.createElement("td");
//             td.textContent = row[key];
//             td.setAttribute("contenteditable", "true"); // Make cells editable
//             td.addEventListener("blur", function () {
//                 row[key] = td.textContent; // Update data when editing is finished
//             });
//             tr.appendChild(td);
//         }

//         // Add a delete button
//         const actionsTd = document.createElement("td");
//         actionsTd.innerHTML = `
//             <button class="delete-btn" onclick="deleteRow(${i})">Delete</button>
//         `;
//         tr.appendChild(actionsTd);

//         // Append the row to the table body
//         tableBody.appendChild(tr);
//     }
// }


// Function to render the table
function renderTable() {
    tableBody.innerHTML = ""; // Clear existing rows

    // Use only the first 20 rows of the data
    const rowsToRender = data.slice(0, 20);

    for (let i = 0; i < rowsToRender.length; i++) {
        const row = rowsToRender[i];
        const tr = document.createElement("tr");

        // Add cells for each value in the row
        for (let key in row) {
            const td = document.createElement("td");
            td.textContent = row[key];
            tr.appendChild(td);
        }

        // Add action buttons
        const actionsTd = document.createElement("td");
        actionsTd.innerHTML =
        `<button class="edit-btn" onclick="editRow(${i})">Edit</button>
        <button class="delete-btn" onclick="deleteRow(${i})">Delete</button>`;
        tr.appendChild(actionsTd);

        // Append the row to the table body
        tableBody.appendChild(tr);
    }
}

// Function to add a new row
function addRow() {
    const emptyRow = {
        invoice_no: "",
        customer_id: "",
        gender: "",
        age: "",
        category: "",
        quantity: "",
        price: "",
        payment_method: "",
        invoice_date: "",
        shopping_mall: "",
    };

    data.unshift(emptyRow); // Add an empty row to the data array
    renderTable(); // Re-render the table
}

// Function to edit a row
function editRow(index) {
    const row = data[index];
    const inputs = [];

    // Prompt for each value in the row
    for (let key in row) {
        const input = prompt("Enter value for " + key, row[key]);
        inputs.push(input);
    }

    // Update the row only if all inputs are valid
    let allValid = true;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] === null) {
            allValid = false;
            break;
        }
    }

    if (allValid) {
        let j = 0;
        for (let key in row) {
            row[key] = inputs[j];
            j++;
        }

        renderTable(); // Re-render the table
    }
}

// Function to delete a row
function deleteRow(index) {
    const confirmDelete = confirm("Are you sure you want to delete this row?");
    if (confirmDelete) {
        data.splice(index, 1); // Remove the row from the data array
        renderTable(); // Re-render the table
    }
}

// Function to download the data as a CSV file
function downloadCSV() {
    if (data.length > 0) {
        const headers = Object.keys(data[0]).join(",");
        const rows = [];

        for (let i = 0; i < data.length; i++) {
            const row = Object.values(data[i]).join(",");
            rows.push(row);
        }

        const csvContent = headers + "\n" + rows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "customer_shopping_data.csv";
        link.click();
    } else {
        alert("No data available to download!");
    }
}

// Add event listeners for the Add Row and Download CSV buttons
document.getElementById("newRowBtn").addEventListener("click", addRow);
document.getElementById("downloadCSVBtn").addEventListener("click", downloadCSV);

// Initial render
renderTable();