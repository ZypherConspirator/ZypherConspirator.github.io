function initializeWatermarkedCanvases() {
    const canvases = document.querySelectorAll(".watermarkedCanvas");
    const images = document.querySelectorAll(".processedImg");
    const fallbackSVG = "/svg/error.svg"; // Path to your fallback SVG
    const watermarkSrc = "/svg/watermark.svg"; // Watermark path

    async function loadImage(src) {
        try {
            const response = await fetch(src, { mode: "cors" });
            if (!response.ok) throw new Error(`Failed to fetch: ${src}`);
            const blob = await response.blob();
            const objectURL = URL.createObjectURL(blob);
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null); // Resolve null on error
                img.src = objectURL;
            });
        } catch (error) {
            console.error(error);
            return null; // Return null if fetch fails
        }
    }

    images.forEach(async (images) => {
        const imageSrc = images.getAttribute("src");
        const spinner = images.parentElement.querySelector('.spinner-border');
        // Fetch and load images
        const [mainImage] = await Promise.all([loadImage(imageSrc)]);

        if (!mainImage) {
            spinner.classList.add('d-none');
            console.warn("Using fallback SVG due to image load failure.");
        }
        else
        {
            spinner.classList.add('d-none');
        }
    });

    canvases.forEach(async (canvas) => {
        const ctx = canvas.getContext("2d");
        const imageSrc = canvas.getAttribute("data-src");
        const spinner = canvas.parentElement.querySelector('.spinner-border');
        // Fetch and load images
        const [mainImage, watermark] = await Promise.all([
            loadImage(imageSrc),
            loadImage(watermarkSrc),
        ]);

        if (!mainImage || !watermark) {
            // Fallback if either the main image or watermark fails
            console.warn("Using fallback SVG due to image load failure.");
            const fallbackImg = await loadImage(fallbackSVG);
            if (fallbackImg) {
                canvas.width = fallbackImg.width * 2;
                canvas.height = fallbackImg.height * 2;
                ctx.drawImage(fallbackImg, 0, 0, canvas.width, canvas.height);
            }
            
            return;
        }
        if (mainImage)
        {
            spinner.classList.add('d-none');
        }
        // Set canvas dimensions while maintaining the aspect ratio
        const minWidth = 700; // Minimum width
        const maxWidth = 800; // Maximum width
        let adjustedImgWidth = mainImage.width * 0.8;
        let adjustedImgHeight = mainImage.height * 0.8;
        // Calculate the canvas width, clamping it between minWidth and maxWidth
        let canvasWidth = Math.min(Math.max(adjustedImgWidth, minWidth), maxWidth);
        // Calculate the height while maintaining the aspect ratio
        let canvasHeight = (adjustedImgHeight / adjustedImgWidth) * canvasWidth;
        //
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;



        // Step 1: Draw the main image (for cutout)
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
        // Step 1: Fill canvas with the average color of the main image
        const averageColor = getAverageColor(ctx, mainImage, canvas.width, canvas.height);
        ctx.fillStyle = averageColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Step 2: Add watermark
        const scaleFactor = 0.08;
        const watermarkWidth = canvas.width * scaleFactor;
        const watermarkHeight = (watermark.height / watermark.width) * watermarkWidth;
        const LogoX = canvas.width - watermarkWidth - 200; // Padding from the right
        const LogoY = canvas.height - watermarkHeight - 240; // Padding from the bottom
        //
        ctx.globalCompositeOperation = "destination-in";
        ctx.globalAlpha = 1;
        ctx.drawImage(watermark, LogoX, LogoY, watermarkWidth, watermarkHeight);

        ctx.globalCompositeOperation = "destination-over";
        ctx.globalAlpha = 0.5;
        ctx.filter = "brightness(0)"; // Make the watermark fully black for the shadow
        ctx.drawImage(
            watermark,
            LogoX + 0.3,
            LogoY + 0.3,
            watermarkWidth,
            watermarkHeight
        );
        ctx.filter = "none";
        // Step 1: Draw the main image
        ctx.globalCompositeOperation = "destination-over";
        ctx.globalAlpha = 1;
        ctx.drawImage(mainImage, 0, 0, canvas.width, canvas.height);

        //Step 3 : overlay noise
        const noiseCanvas = document.createElement("canvas");
        const noiseCtx = noiseCanvas.getContext("2d");
        noiseCanvas.width = canvas.width;
        noiseCanvas.height = canvas.height;
        //
        const noiseImageData = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
        const data = noiseImageData.data;
        for (let i = 0; i < data.length; i += 4) 
            {
            const r = Math.random() * 255;
            const g = Math.random() * 255;
            const b = Math.random() * 255;
            data[i] = r;     // Red
            data[i + 1] = g; // Green
            data[i + 2] = b; // Blue
            data[i + 3] = 255; // Alpha
        }
        noiseCtx.putImageData(noiseImageData, 0, 0);
        //
        ctx.globalCompositeOperation = "multiply";
        ctx.globalAlpha = 0.15;
        ctx.drawImage(noiseCanvas, 0, 0, canvas.width, canvas.height);
    });

    // Modal logic (unchanged)
    const modal = document.getElementById("image-modal");
    const modalBody = modal.querySelector(".Modal-Highlight");
    let originalParent = null; // To store the original parent of the element (canvas/img)

    document.querySelectorAll(".thumbnail").forEach(thumbnail => {
        thumbnail.addEventListener("click", e => {
            e.preventDefault();

            const canvas = thumbnail.querySelector("canvas");
            const img = thumbnail.querySelector("img");
            const elementToMove = canvas || img; // Choose the first available element (canvas or img)

            if (!elementToMove) return;

            originalParent = elementToMove.parentElement; // Store original parent
            modalBody.appendChild(elementToMove); // Move element to modal
            //elementToMove.classList.add("position-absolute");
            //elementToMove.classList.add("top-50");
            //elementToMove.classList.add("start-50");
            //elementToMove.classList.add("translate-middle");
            $("#image-modal").modal("show");
        });
    });

    modal.addEventListener("click", () => {
        const elementInModal = modalBody.querySelector("canvas") || modalBody.querySelector("img");
        if (originalParent && elementInModal) {
            originalParent.appendChild(elementInModal); // Move element back to original parent
            originalParent = null; // Reset original parent
            //elementInModal.classList.remove("position-absolute");
            //elementInModal.classList.remove("top-50");
            //elementInModal.classList.remove("start-50");
            //elementInModal.classList.remove("translate-middle");
        }
        $("#image-modal").modal("hide");
    });
}

function getAverageColor(ctx, img, width, height) {
    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let r = 0, g = 0, b = 0;
    let validPixelCount = 0;

    // Thresholds to exclude colors near black or white
    const minThreshold = 50;  // Exclude colors too close to black
    const maxThreshold = 200; // Exclude colors too close to white

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        // Check if the color is within the valid range
        if (
            red > minThreshold && green > minThreshold && blue > minThreshold &&
            red < maxThreshold && green < maxThreshold && blue < maxThreshold
        ) {
            r += red;
            g += green;
            b += blue;
            validPixelCount++;
        }
    }

    // Avoid division by zero if no valid pixels are found
    if (validPixelCount === 0) {
        return `rgb(128, 128, 128)`; // Default to a neutral gray if no valid pixels
    }

    // Calculate the average for each channel
    r = Math.round(r / validPixelCount) + 40;
    g = Math.round(g / validPixelCount) + 40;
    b = Math.round(b / validPixelCount) + 40;

    return `rgb(${r}, ${g}, ${b})`;
}

// 1. Trigger on initial DOM load
document.addEventListener("DOMContentLoaded", async => initializeWatermarkedCanvases());

// 2. Trigger on your custom event
document.addEventListener("pageTransitionFinished", async => initializeWatermarkedCanvases());