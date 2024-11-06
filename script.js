
let data;
document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
  const file = event.target.files[0]; // Get the file
  if (file) {
    const reader = new FileReader();

    // Read the file as binary
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Get the first sheet name
      const firstSheetName = workbook.SheetNames[0];
      // Get the first worksheet
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      displayExcelData(jsonData);  // Display the data on the web page
    };

    reader.readAsArrayBuffer(file);
  }
}

// Display the data in a table
function displayExcelData(data) {
  const output = document.getElementById('excelData');
  let html = '<table border="1">';

  data.forEach((row) => {
    html += '<tr>';
    row.forEach((cell) => {
      html += `<td>${cell || ''}</td>`;
    });
    html += '</tr>';
  });

  html += '</table>';
  output.innerHTML = html;
}

//document.getElementById('convertButton').addEventListener('click', handleFileSelect);

function handleFileSelect() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0]; // Get the uploaded file
  if (file) {
    const reader = new FileReader();

    // Read the file as binary string
    reader.onload = (e) => {
      const data = e.target.result;

      // Parse the Excel file
      const workbook = XLSX.read(data, { type: 'binary' });

      // Convert all sheets to JSON
      const jsonData = {};
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        jsonData[sheetName] = XLSX.utils.sheet_to_json(worksheet);
      });

      consoleDisplayJson(jsonData); // Display the JSON data
    };

    reader.readAsBinaryString(file); // Read the file as a binary string
  } else {
    alert("Please upload a valid Excel file.");
  }
}


function consoleDisplayJson(jsonData) {
  // Lưu trữ dữ liệu JSON trong biến data để xử lý sau
  data = jsonData;

  // Lấy ra mảng từ sheet đầu tiên
  let firstSheet = Object.values(data)[0];

  // Lấy giá trị của key "0" trong từng đối tượng của sheet đầu tiên
  let GVBM = [...new Set(firstSheet.map((item) => item[0]))];


  teacherDropdown(GVBM, data)
}

function teacherDropdown(GVBM, data) {
  const dropdownList = document.getElementById('dropdownList');
  dropdownList.innerHTML = ''; // Clear any previous options

  // Loop through GVBM array and create a list item for each value
  GVBM.forEach((item) => {
    const listItem = document.createElement('a');
    listItem.href = "#";
    listItem.textContent = item;
    listItem.onclick = function() {
      const matchedItem = findItemInDSHS(item, data);
      console.log(matchedItem[2]); // Log the matched object
      
      function generateTable(matchedItem) {
        const tableBody = document.querySelector('#dataTable tbody');
        const rows = 10; // Number of rows in the table


        
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('tr');
            const cell0 = document.createElement('td');
            cell0.textContent = i + 1;
            // Column 1: Values from 1 to 10
            const cell1 = document.createElement('td');
            cell1.textContent = matchedItem[i + 1];

            // Column 2: Values from 11 to 20
            const cell2 = document.createElement('td');
            cell2.textContent = matchedItem[i + 11];
            const cell3 = document.createElement('td');
            cell3.textContent = matchedItem[i + 21];
            const cell4 = document.createElement('td');
            cell4.textContent = matchedItem[i + 31];
            const cell5 = document.createElement('td');
            cell5.textContent = matchedItem[i + 41];

            // Append cells to the row
            row.appendChild(cell0);
            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.appendChild(cell4);
            row.appendChild(cell5);


            // Append row to the table body
            tableBody.appendChild(row);
        }
    }

    //Call the function to generate the table
    generateTable(matchedItem);

    };
    function findItemInDSHS(value, data) {
      // Loop through each object in DSHS and check if it contains the value in any key
      return data.DSHS.find(obj => Object.values(obj).includes(value));
    }
  
    // Call the function to populate the dropdown on page load
    dropdownList.appendChild(listItem);
  });
}
// Call the function to populate the dropdown on page load
window.onload = populateDropdown;