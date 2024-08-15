// Get and inject current date

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let today = new Date();

let day = today.getDate();
let month = months[today.getMonth()];
let year = today.getFullYear();

let currentDate = `${day} ${month}, ${year}`;
const dateForPDFName = `${day}${month.slice(0, 3).toUpperCase()}${year}`;

let datePlaceholder = document.getElementById("current-date");
datePlaceholder.innerText = currentDate;

const formatPhoneNumber = () => {
  let phoneNumber = document.getElementById("clientPhone").value;

  // Remove all non-digit characters
  let digitsOnly = phoneNumber.replace(/\D/g, "");

  // Format the number as (123) 456-7890
  let formattedNumber = ``;

  if (phoneNumber.length < 4) {
    formattedNumber = `(${digitsOnly}`;
  } else if (phoneNumber.length > 3 && phoneNumber.length < 9) {
    formattedNumber = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}`;
  } else {
    formattedNumber = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(
      3,
      6
    )} - ${digitsOnly.slice(6)}`;
  }

  document.getElementById("clientPhone").value = formattedNumber;
};

function validateInput(event) {
  // Allow only digits (0-9) and backspace
  if (!(event.key >= "0" && event.key <= "9") && event.key !== "Backspace") {
    event.preventDefault();
  } else {
    formatPhoneNumber();
  }
}

// Create and download pdf
const createPDF = () => {
  const clientName = document.getElementById("clientName").value;
  const clientPhone = document.getElementById("clientPhone").value;
  const clientEmail = document.getElementById("clientEmail").value;

  const animatchName = document.getElementById("animatchName").value;
  let newName = document.getElementById("newName").value;
  if (!newName) newName = animatchName;
  const dateAdopted = document.getElementById("dateAdopted").value;
  const yearAdopted = dateAdopted.slice(0, 4);
  const monthAdopted = dateAdopted.slice(6, 8);
  const dayAdopted = dateAdopted.slice(-2);
  const formattedDateAdopted = `${dayAdopted} ${
    months[parseInt(monthAdopted) - 1]
  }, ${yearAdopted}`;
  const issues = document.getElementById("issues").value.trim();
  const tried = document.getElementById("tried").value.trim();
  const recommendations = document
    .getElementById("recommendations")
    .value.trim();

  const followUpPhone = document.getElementById("phone").checked;
  const followUpEmail = document.getElementById("email").checked;
  const followUpHome = document.getElementById("visit").checked;

  const followUp = followUpPhone
    ? "phone"
    : followUpEmail
    ? "email"
    : "home visit";

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("portrait", "mm", "a4");

  let y = 20;

  const pageHeight = doc.internal.pageSize.height;

  const addTextToPDF = (text, x, y) => {
    const lineHeight = 8;
    const textLines = doc.splitTextToSize(text, 180);
    const blockHeight = textLines.length * lineHeight;

    // Check if adding this block will overflow the page
    if (y + blockHeight > pageHeight - 20) {
      // 20 is margin from the bottom
      doc.addPage();
      y = 20; // Reset Y coordinate for the new page
    }
    doc.text(textLines, x, y);
    return blockHeight;
  };
  doc.setFontSize(20);
  doc.text("Client", 20, y);
  doc.text(`Date: ${currentDate}`, 130, y);
  y += 7;

  doc.setFontSize(14);
  doc.text(`Name: ${clientName}`, 20, y);
  y += 7;
  doc.text(`Phone: ${clientPhone}`, 20, y);
  y += 7;
  doc.text(`Email: ${clientEmail}`, 20, y);
  y += 15;

  doc.setFontSize(20);
  doc.text("Dog Info", 20, y);
  y += 7;
  doc.setFontSize(14);
  doc.text(`Dog Name (Animatch given): ${animatchName}`, 20, y);
  y += 7;
  doc.text(`New Dog Name (owner given): ${newName}`, 20, y);
  y += 7;
  doc.text(`Date Adopted: ${formattedDateAdopted}`, 20, y);
  y += 10;
  doc.setFontSize(20);
  doc.text("Issues", 20, y);
  y += 7;
  doc.setFontSize(14);
  y += addTextToPDF(issues, 20, y);
  y += 5;

  doc.setFontSize(20);
  doc.text("Tried", 20, y);
  y += 7;
  doc.setFontSize(14);
  y += addTextToPDF(tried, 20, y);
  y += 5;

  doc.setFontSize(20);
  doc.text("Recommendations", 20, y);
  y += 7;
  doc.setFontSize(14);
  y += addTextToPDF(recommendations, 20, y);
  y += 5;

  doc.setFontSize(18);
  y += addTextToPDF(`Follow up by ${followUp}`, 20, y);

  doc.save(`${newName.replaceAll(" ", "-")}-${dateForPDFName}.pdf`);

  // doc.html(html, {
  //   callback: function () {
  //     doc.save("Lee-sample-file.pdf");
  //   },
  //   x: 20,
  //   y: 20,
  //   width: 170,
  // });
};
