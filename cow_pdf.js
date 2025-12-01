// cow_pdf.js
const scriptURL = "https://script.google.com/macros/s/AKfycbzC8mWC5IDrtnYOm_lVfOdK2MX3sliWjpjk3ObpRazY5V6EJjdUCZhoPyPLHq4osdQ0Gg/exec";

function formatDate(rawDate) {
  let d = new Date(rawDate);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function formatTime(rawTime) {
  let t = new Date(rawTime);
  return `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}:${String(t.getSeconds()).padStart(2,'0')}`;
}

async function downloadCowPDF() {
  const response = await fetch(scriptURL);
  const rawCSV = await response.text();
  let rows = rawCSV.trim().split("\n");
  let tableData = [];
  for(let i=1;i<rows.length;i++){
    let cols = rows[i].split(",");
    tableData.push([
      formatDate(cols[0]),
      formatTime(cols[1]),
      cols[2],
      cols[3]
    ]);
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Cow Weight Report", 14, 15);

  doc.autoTable({
    startY: 25,
    head: [['DATE', 'TIME', 'NO OF COWS', 'WEIGHT']],
    body: tableData,
    headStyles:{fillColor:[0,102,204],textColor:[255,255,255],halign:'center'},
    bodyStyles:{fontSize:11},
    theme:'grid'
  });

  doc.save("cow_data.pdf");
}
