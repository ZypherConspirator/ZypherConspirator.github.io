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
            canvas.width = image.width * 2;
            canvas.height = image.height * 2;

            // Step 2: Generate and overlay noise
            ctx.globalCompositeOperation = "source-over"; // Blend noise
            ctx.globalAlpha = 1; // Set noise opacity

            const noiseImageData = ctx.createImageData(canvas.width, canvas.height);
            const data = noiseImageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = Math.random() * 255; // Red
                const g = Math.random() * 255; // Green
                const b = Math.random() * 255; // Blue
                data[i] = r;
                data[i + 1] = g;
                data[i + 2] = b;
                data[i + 3] = 10; // Alpha
            }

            ctx.putImageData(noiseImageData, 0, 0);
            
            // Step 1: Draw the image
            ctx.globalCompositeOperation = "overlay";
            ctx.globalAlpha = 0.9;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);


            // Step 3: Add watermark
            ctx.globalCompositeOperation = "difference";
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

    // Modal logic (unchanged)
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
