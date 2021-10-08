const fileInput = document.querySelector("#upload");

const pixelatedImage = document.querySelector("#pixelatedImage");
// storying a copy of the original image
const originalImage = pixelatedImage.cloneNode(true);

const pixelationElement = document.querySelector("#pixelationRange");

fileInput.addEventListener("change", async (e) => {
  const [file] = fileInput.files;
  // showing the uploaded image
  pixelatedImage.src = await fileToDataUri(file);
  // storing the original image
  originalImage.src = await fileToDataUri(file);
  pixelationElement.value = 0;
  return false;
});

pixelationElement.oninput = (e) => {
  pixelateImage(originalImage, parseInt(e.target.value));
};

console.log("b");

function fileToDataUri(field) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(reader.result);
    });
    reader.readAsDataURL(field);
  });
}

function pixelateImage(originalImage, pixelationFactor) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const originalWidth = originalImage.width;
  const originalHeight = originalImage.height;

  const canvasWidth = originalWidth;
  const canvasHeight = originalHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  context.drawImage(originalImage, 0, 0, originalWidth, originalHeight);

  const originalImageData = context.getImageData(
    0,
    0,
    originalWidth,
    originalHeight
  ).data;

  if (pixelationFactor !== 0) {
    for (let y = 0; y < originalHeight; y += pixelationFactor) {
      for (let x = 0; x < originalWidth; x += pixelationFactor) {
        // extracting the position of the sample pixel
        const pixelIndexPosition = (x + y * originalWidth) * 4;

        // drawing a square replacing the current pixels
        context.fillStyle = `rgba(
          ${originalImageData[pixelIndexPosition]},
          ${originalImageData[pixelIndexPosition + 1]},
          ${originalImageData[pixelIndexPosition + 2]},
          ${originalImageData[pixelIndexPosition + 3]}
        )`;
        context.fillRect(x, y, pixelationFactor, pixelationFactor);
      }
    }
  }
  pixelatedImage.src = canvas.toDataURL();
}