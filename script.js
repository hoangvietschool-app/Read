

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

document.getElementById('convertButton').addEventListener('click', handleFileSelect);

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
  // const jsonOutput = document.getElementById('jsonOutput');
  // jsonOutput.textContent = JSON.stringify(jsonData, null, 2); // Format JSON with indentation
  console.log(jsonData)

}
// Function to display JSON output in a preformatted text area
// function displayJson(jsonData) {
//   const jsonOutput = document.getElementById('jsonOutput');
//   jsonOutput.textContent = JSON.stringify(jsonData, null, 2); // Format JSON with indentation
//   // console.log(jsonData);
// }