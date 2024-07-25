export function setupExperience() {
  function downloadFile(filePath) {
    const link = document.createElement("a");
    link.href = filePath;

    const fileName = filePath.split("/").pop();
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  document
    .getElementById("experience-download-container")
    .addEventListener("click", (e) => {
      if (e.target && e.target.id === "download-profile") {
        downloadFile("./assets/Dmitrii_Shatokhin_Profile.pdf");
      }
      if (e.target && e.target.id === "download-resume") {
        downloadFile("./assets/Dmitrii_Shatokhin_Resume.pdf");
      }
    });
}
