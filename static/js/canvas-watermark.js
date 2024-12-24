document.addEventListener("DOMContentLoaded", () => {
    const canvases = document.querySelectorAll(".watermarkedCanvas");
    const watermark = new Image();
    watermark.src = "/img/cat/AceTagLogo.png";
    const fallbackSVG = "/img/error.svg"; // Path to your fallback SVG

    // Add watermark to each canvas
    canvases.forEach(canvas => {
        const ctx = canvas.getContext("2d");
        const image = new Image();
        const src = canvas.getAttribute("data-src");

        image.src = src;
        image.crossOrigin = "anonymous";
        image.onload = () => {
            ctx.globalCompositeOperation = 'normal';
            canvas.width = image.width * 2;
            canvas.height = image.height * 2;

            // Draw the image
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = 'overlay';
            ctx.globalAlpha = 0.1;

            function generateNoise(ctx) {
                const imageData = ctx.createImageData(canvas.width, canvas.height);
                const data = imageData.data;
          
                for (let i = 0; i < data.length; i += 3) {
                  const color = Math.random() * 255; // Generate random intensity for R, G, B
                  data[i] = Math.random() * 255; // Red
                  data[i + 1] = Math.random() * 255; // Green
                  data[i + 2] = Math.random() * 255; // Blue
                }
          
                ctx.putImageData(imageData, 0, 0);
              }
          
              // Generate static noise once
              generateNoise(ctx);

            // Add watermark
            /* globalCompositeOperation :
            normal | multiply | screen | overlay | 
            darken | lighten | color-dodge | color-burn | hard-light | 
            soft-light | difference | exclusion | hue | saturation | 
            color | luminosity
            */
            ctx.globalCompositeOperation = 'difference';
            ctx.globalAlpha = 0.4;
            const watermarkWidth = canvas.width / 5; // Scale watermark
            const watermarkHeight = (watermark.height / watermark.width) * watermarkWidth;
            const x = (canvas.width - watermarkWidth) / 2;
            const y = canvas.height - watermarkHeight - 20; // Padding from the bottom
            ctx.drawImage(watermark, x, y, watermarkWidth, watermarkHeight);
        };
        image.onerror = () => {
            // Use fallback SVG if the main image fails to load
            image.src = fallbackSVG;
        };
        canvas.removeAttribute("data-src");
    });

    // Handle modal logic
    const modal = document.getElementById("image-modal");
    const modalBody = modal.querySelector(".modal-body");
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
            elementToMove.classList.add("position-absolute");
            elementToMove.classList.add("top-50");
            elementToMove.classList.add("start-50");
            elementToMove.classList.add("translate-middle");
            $("#image-modal").modal("show");
        });
    });

    // Close modal and revert element
    modal.addEventListener("click", () => {
        const elementInModal = modalBody.querySelector("canvas") || modalBody.querySelector("img");
        if (originalParent && elementInModal) {
            originalParent.appendChild(elementInModal); // Move element back to original parent
            originalParent = null; // Reset original parent
            elementInModal.classList.remove("position-absolute");
            elementInModal.classList.remove("top-50");
            elementInModal.classList.remove("start-50");
            elementInModal.classList.remove("translate-middle");
        }
        $("#image-modal").modal("hide");
    });
});