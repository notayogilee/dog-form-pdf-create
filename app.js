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

datePlaceholder.value = `${year}-${today
  .getMonth()
  .toString()
  .padStart(2, "0")}-${day}`;

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
  const clientAddress = document.getElementById("clientAddress").value;

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
  const notes = document.getElementById("notes").value.trim();

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
  y += 10;

  doc.setFontSize(14);

  doc.text(`Name:`, 20, y);

  let textField = new doc.AcroForm.TextField();
  textField.Rect = [35, y - 5, 100, y + 5];
  textField.height = 7;
  textField.width = 150;
  textField.backgroundColor = "grey";
  textField.fileSelect - true;
  textField.value = clientName;
  doc.addField(textField);
  y += 10;

  doc.text(`Phone:`, 20, y);

  let phoneField = new doc.AcroForm.TextField();
  phoneField.Rect = [37, y - 5, 100, y + 5];
  phoneField.height = 7;
  phoneField.width = 40;
  phoneField.backgroundColor = "grey";
  phoneField.value = clientPhone;
  doc.addField(phoneField);

  doc.text(`Email:`, 80, y);
  let emailField = new doc.AcroForm.TextField();
  emailField.Rect = [95, y - 5, 100, y + 5];
  emailField.height = 7;
  emailField.width = 90;
  emailField.backgroundColor = "grey";
  emailField.value = clientEmail;
  doc.addField(emailField);
  y += 10;

  doc.text(`Address:`, 20, y);

  let addressField = new doc.AcroForm.TextField();
  addressField.Rect = [40, y - 5, 100, y + 5];
  addressField.height = 7;
  addressField.width = 145;
  addressField.backgroundColor = "grey";
  addressField.value = clientAddress;
  doc.addField(addressField);
  y += 15;

  doc.setFontSize(20);
  doc.text("Dog Info", 20, y);
  y += 7;
  doc.setFontSize(14);
  doc.text(`Animatch Name: ${animatchName}`, 20, y);

  doc.text(`Given Name:`, 100, y);

  let newDogNameField = new doc.AcroForm.TextField();
  newDogNameField.Rect = [130, y - 5, 100, y + 5];
  newDogNameField.height = 7;
  newDogNameField.width = 60;
  newDogNameField.backgroundColor = "grey";
  newDogNameField.value = newName;
  doc.addField(newDogNameField);
  y += 7;

  doc.text(`Date Adopted: ${formattedDateAdopted}`, 20, y);
  y += 10;
  doc.setFontSize(20);
  doc.text("Issues", 20, y);
  y += 5;
  doc.setFontSize(14);
  let issuesField = new doc.AcroForm.TextField();
  issuesField.Rect = [20, y, 180, y + 10];
  issuesField.height = 30;
  issuesField.width = 180;
  issuesField.backgroundColor = "grey";
  issuesField.value = issues;
  issuesField.multiline = true;
  doc.addField(issuesField);
  y += 40;

  doc.setFontSize(20);
  doc.text("Tried", 20, y);
  y += 5;
  doc.setFontSize(14);
  let triedField = new doc.AcroForm.TextField();
  triedField.Rect = [20, y, 180, y + 10];
  triedField.height = 30;
  triedField.width = 180;
  triedField.backgroundColor = "grey";
  triedField.value = tried;
  triedField.multiline = true;
  doc.addField(triedField);
  y += 40;

  doc.setFontSize(20);
  doc.text("Recommendations", 20, y);
  y += 5;
  doc.setFontSize(14);
  let recommendationsField = new doc.AcroForm.TextField();
  recommendationsField.Rect = [20, y, 180, y + 10];
  recommendationsField.height = 30;
  recommendationsField.width = 180;
  recommendationsField.backgroundColor = "grey";
  recommendationsField.value = recommendations;
  recommendationsField.multiline = true;
  doc.addField(recommendationsField);
  y += 40;

  doc.setFontSize(20);
  doc.text("Notes", 20, y);
  y += 5;
  doc.setFontSize(14);
  let notesField = new doc.AcroForm.TextField();
  notesField.Rect = [20, y, 180, y];
  notesField.height = 30;
  notesField.width = 180;
  notesField.backgroundColor = "grey";
  notesField.value = notes;
  notesField.multiline = true;
  console.log(notesField);
  doc.addField(notesField);
  y += 40;

  doc.setFontSize(18);
  y += addTextToPDF(`Follow up by ${followUp}`, 20, y);

  doc.save(`${newName.replaceAll(" ", "-")}-${dateForPDFName}.pdf`);
};
