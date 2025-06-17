$("#submitButtonId").click(function (event) {
  event.preventDefault(); // Prevent the default form submission

  function showSuccessMessage(msg, color) {
    const messageElement = document.getElementById("successMessage");
    messageElement.innerHTML = msg;
    messageElement.style.backgroundColor = color;
    messageElement.style.fontWeight = "bolder";
    messageElement.classList.add("show");

    // Masquer le message après 3 secondes
    setTimeout(() => {
      messageElement.classList.remove("show");
    }, 3000);
  }

  // Serialize the form data
  const formArray = $("#idForm").serializeArray();
  const jsonData = {};

  // Convert the serialized array to a JSON object
  $.each(formArray, function () {
    jsonData[this.name] = this.value;
  });

  // Convert the object to a JSON string
  const jsonString = JSON.stringify(jsonData);




  // Now you can use jsonString in an AJAX request or wherever needed
  $.ajax({
    type: "POST",
    url: "https://jiem.pythonanywhere.com/portfolio/message_handler",
    contentType: "application/json",
    data: jsonString,
    beforeSend: function (data) {
      showSuccessMessage("Envi en cours !", "#286dc7");
    },
    success: function (data) {
      showSuccessMessage("Message envoyé ! Merci", "#4CAF50");
      // console.log("Message sent successfully!", data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showSuccessMessage("Erreur d'envoi du message ?!", "#ba0000");
      // console.error("Error sending message:", textStatus, errorThrown);
    },
  });
});
