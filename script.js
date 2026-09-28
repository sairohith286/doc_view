const fileInput = document.getElementById("fileInput");
const dropArea = document.getElementById("dropArea");

const fileSection = document.getElementById("fileSection");

const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const fileIcon = document.getElementById("fileIcon");

const viewBtn = document.getElementById("viewBtn");
const downloadBtn = document.getElementById("downloadBtn");

const removeBtn = document.getElementById("removeBtn");

const viewerSection = document.getElementById("viewerSection");
const viewer = document.getElementById("viewer");
const closeViewer = document.getElementById("closeViewer");

let selectedFile = null;
let fileURL = null;


/* FILE SELECT */

fileInput.addEventListener("change", function () {

    if (this.files.length > 0) {

        handleFile(this.files[0]);

    }

});


/* DRAG & DROP */

dropArea.addEventListener("dragover", function (event) {

    event.preventDefault();

    dropArea.classList.add("dragover");

});


dropArea.addEventListener("dragleave", function () {

    dropArea.classList.remove("dragover");

});


dropArea.addEventListener("drop", function (event) {

    event.preventDefault();

    dropArea.classList.remove("dragover");

    const files = event.dataTransfer.files;

    if (files.length > 0) {

        handleFile(files[0]);

    }

});


/* HANDLE FILE */

function handleFile(file) {

    const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];

    const extension = file.name.split(".").pop().toLowerCase();

    const allowedExtensions = ["pdf", "docx", "pptx"];

    if (!allowedExtensions.includes(extension)) {

        alert("Please upload a PDF, DOCX or PPTX file.");

        return;

    }


    selectedFile = file;


    /* CREATE URL */

    if (fileURL) {

        URL.revokeObjectURL(fileURL);

    }

    fileURL = URL.createObjectURL(file);


    /* FILE INFORMATION */

    fileName.textContent = file.name;

    fileSize.textContent = formatFileSize(file.size);


    /* ICON */

    if (extension === "pdf") {

        fileIcon.textContent = "📕";

    }
    else if (extension === "docx") {

        fileIcon.textContent = "📘";

    }
    else if (extension === "pptx") {

        fileIcon.textContent = "📙";

    }


    /* DOWNLOAD */

    downloadBtn.href = fileURL;

    downloadBtn.download = file.name;


    /* SHOW FILE */

    fileSection.classList.remove("hidden");


    /* CLOSE PREVIOUS VIEW */

    viewerSection.classList.add("hidden");

    viewer.innerHTML = "";

}


/* FORMAT SIZE */

function formatFileSize(bytes) {

    if (bytes === 0) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const index = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    return (
        (bytes / Math.pow(1024, index)).toFixed(2)
        + " "
        + units[index]
    );

}


/* VIEW FILE */

viewBtn.addEventListener("click", function () {

    if (!selectedFile) {

        return;

    }


    const extension =
        selectedFile.name
        .split(".")
        .pop()
        .toLowerCase();


    viewer.innerHTML = "";


    /* PDF */

    if (extension === "pdf") {

        const iframe = document.createElement("iframe");

        iframe.src = fileURL;

        viewer.appendChild(iframe);

    }


    /* DOCX */

    else if (extension === "docx") {

        viewer.innerHTML = `

            <div class="unsupported">

                <h2>📘 DOCX File</h2>

                <p>
                    Your DOCX file is ready to download.
                </p>

                <p>
                    Browser-based preview can be added
                    using a DOCX rendering library.
                </p>

            </div>

        `;

    }


    /* PPTX */

    else if (extension === "pptx") {

        viewer.innerHTML = `

            <div class="unsupported">

                <h2>📙 PPTX File</h2>

                <p>
                    Your PowerPoint file is ready to download.
                </p>

                <p>
                    Browser-based slide preview can be
                    added using a PowerPoint rendering library.
                </p>

            </div>

        `;

    }


    viewerSection.classList.remove("hidden");


    viewerSection.scrollIntoView({
        behavior: "smooth"
    });

});


/* CLOSE VIEWER */

closeViewer.addEventListener("click", function () {

    viewerSection.classList.add("hidden");

    viewer.innerHTML = "";

});


/* REMOVE FILE */

removeBtn.addEventListener("click", function () {

    if (fileURL) {

        URL.revokeObjectURL(fileURL);

    }


    selectedFile = null;

    fileURL = null;

    fileInput.value = "";

    fileSection.classList.add("hidden");

    viewerSection.classList.add("hidden");

    viewer.innerHTML = "";

});