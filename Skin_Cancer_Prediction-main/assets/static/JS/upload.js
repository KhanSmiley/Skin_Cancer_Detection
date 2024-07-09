// Content information for each class label
const classInfo = {
    "melanocytic_nevi": {
        "name": "Melanocytic Nevi",
        "description": "Melanocytic nevi are moles consisting of an accumulation of melanocytes (pigment-producing cells). Most moles are benign, but some can develop into melanoma."
    },
    "melanoma": {
        "name": "Melanoma",
        "description": "Melanoma is a serious form of skin cancer that originates in melanocytes. Early detection and treatment are crucial, as melanoma can spread."
    },
    "vascular_lesions": {
        "name": "Vascular Lesions",
        "description": "Vascular lesions are abnormalities involving blood vessels. They can range from benign birthmarks to more serious conditions requiring medical attention."
    },
    "dermatofibroma": {
        "name": "Dermatofibroma",
        "description": "Dermatofibroma is a common, benign skin growth that often appears as a small, firm nodule. It's typically harmless and may not require treatment."
    },
    "benign_keratosis_like_lesions": {
        "name": "Benign Keratosis-like Lesions",
        "description": "Benign keratosis-like lesions are non-cancerous skin growths. They can include conditions like seborrheic keratosis and are common as people age."
    },
    "basal_cell_carcinoma": {
        "name": "Basal Cell Carcinoma",
        "description": "Basal cell carcinoma is a common form of skin cancer that originates in the basal cells. It grows slowly but should be treated to avoid complications."
    },
    "actinic_keratoses": {
        "name": "Actinic Keratoses",
        "description": "Actinic keratoses are rough, scaly patches from sun damage. They can be a precursor to squamous cell carcinoma, so medical attention is advised."
    }
};

// Event listener for file input change
$("#file-input").change(function() {
    var file = this.files[0];
    handleImage(file);
});

// Function to handle image upload and AJAX submission
function handleImage(file) {
    if (file.type.match('image.*')) {
        var reader = new FileReader();
        reader.onload = function(event) {
            $("#uploaded-image").attr("src", event.target.result);
        };
        reader.readAsDataURL(file);

        submitFormWithAJAX(); // Process the image with AJAX
    } else {
        alert("Please upload an image file.");
    }
}

// Function to submit the form with AJAX
function submitFormWithAJAX() {
    $("#processing-message").show();
    $("#results").hide();
    $("#error-message").hide();

    var formData = new FormData();
    var fileInput = document.getElementById("file-input");
    formData.append("img", fileInput.files[0]);

    $.ajax({
        url: "/prediction",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            $("#processing-message").hide();

            if (response.success) {
                var pred_class = response.prediction;
                var class_info = classInfo[pred_class];

                var alertClass = class_info ? "alert-success" : "alert-danger";
                var resultText = class_info ? class_info.name : "Unknown Class";

                // Display the predicted class
                $("#result-message").attr("class", `alert ${alertClass}`).text(resultText);
                $("#results").show(); 

                if (class_info) {
                    $("#result-additional-info").html(`
                        <h3>${class_info.name}</h3>
                        <p>${class_info.description}</p>
                    `);
                } else {
                    $("#result-additional-info").html("No information available.");
                }
            } else {
                $("#error-message").show().text("An error occurred while processing the prediction.");
            }
        },
        error: function() {
            $("#processing-message").hide();
            $("#error-message").show().text("An error occurred during processing. Please try again.");
        }
    });
}

// Drag-and-Drop Functionality
$(document).ready(function () {
    const imageUpload = $("#image-upload");

    imageUpload.on("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        imageUpload.addClass("dragover"); // Optional: visual cue
    });

    imageUpload.on("dragleave", function (e) {
        e.preventDefault();
        e.stopPropagation();
        imageUpload.removeClass("dragover"); // Reset visual cue
    });

    imageUpload.on("drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
        imageUpload.removeClass("dragover");

        const files = e.originalEvent.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0]; // Handle only the first file
            handleImage(file); // Process the file
        } else {
            alert("Please upload an image file.");
        }
    });
});
