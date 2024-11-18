let data = []; // To hold the large dataset
let currentPage = 1; // Current page for pagination
const rowsPerPage = 20; // Number of rows per page
let filteredData = []; // Holds filtered data for search results
let currentSort = { column: null, order: 'asc' }; // Tracks the current sorting state

// Function to fetch data from the JSON file
async function fetchData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        data = await response.json();
        filteredData = data; // Initialize filteredData as the full dataset
        displayData(getPageData()); // Display the first page of data
    } catch (error) {
        console.error('Error:', error);
    }
}

// Get data for the current page
function getPageData() {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
}

// Display the data in the table
const displayData = (data) => {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    data.forEach(row => {
        const newRow = `
            <tr>
                <td>${row.Name || 'N/A'}</td>
                <td>${row['Rank (CRL)'] || 'N/A'}</td>
                <td>${row['Advanced Roll No.'] || 'N/A'}</td>
                <td>${row.City || 'N/A'}</td>
                <td>${row.State || 'N/A'}</td>
                <td>${row.Branch || 'N/A'}</td>
                <td>${row.Category || 'N/A'}</td>
            </tr>`;
        tableBody.insertAdjacentHTML('beforeend', newRow);
    });
};

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Change the page when next or previous is clicked
function changePage(direction) {
    currentPage += direction;
    displayData(getPageData());
}

// Function to search data (indexed and case-insensitive)
function searchData() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    filteredData = data.filter(item => {
        return Object.keys(item).some(key => {
            const value = item[key].toString().toLowerCase();
            return value.includes(searchInput);
        });
    });
    currentPage = 1; // Reset to the first page when search changes
    displayData(getPageData());
}

// Function to handle sorting when a column header is clicked
function sortTable(column) {
    const order = currentSort.column === column && currentSort.order === 'asc' ? 'desc' : 'asc';
    currentSort = { column, order };

    // Sort the data based on the clicked column
    filteredData.sort((a, b) => {
        const aValue = a[column] || '';
        const bValue = b[column] || '';
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    });

    // Update the arrows
    updateSortArrows(column, order);

    // Display the sorted data
    displayData(getPageData());
}

// Update sort arrows (up/down)
function updateSortArrows(column, order) {
    // Reset all arrows
    const arrows = document.querySelectorAll('.sort-arrow');
    arrows.forEach(arrow => arrow.classList.remove('asc', 'desc'));
    arrows.forEach(arrow => arrow.style.visibility = 'hidden');

    // Show the appropriate arrow for the sorted column
    const arrow = document.getElementById('sort' + column.replace(/ /g, ''));
    arrow.style.visibility = 'visible';
    arrow.classList.add(order);
}

// Fetch and display the data on page load
fetchData();