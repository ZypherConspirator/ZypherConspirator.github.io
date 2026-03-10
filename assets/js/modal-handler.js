function modalHandler(){ 
    // Modal logic
    const modal = document.getElementById("image-modal");
    const modalBody = modal.querySelector(".Modal-Highlight");
    let placeholder = null; // To track the temporary div

    document.querySelectorAll(".thumbnail").forEach(thumbnail => {
        thumbnail.addEventListener("click", e => {
            e.preventDefault();

            const canvas = thumbnail.querySelector("canvas");
            const img = thumbnail.querySelector("img");
            const elementToMove = canvas || img;

            if (!elementToMove) return;

            // 1. Create the dummy placeholder
            placeholder = document.createElement("div");
            placeholder.style.width = `${elementToMove.offsetWidth}px`;
            placeholder.style.height = `${elementToMove.offsetHeight}px`;
            placeholder.style.display = "inline-block"; // or 'block' depending on your layout
            placeholder.className = "modal-placeholder"; 

            // 2. Insert placeholder before the element, then move element to modal
            elementToMove.parentNode.insertBefore(placeholder, elementToMove);
            modalBody.appendChild(elementToMove);
            // getting details
            const maintitle = thumbnail.querySelector(".gal-title");;
            const subtitle = thumbnail.querySelector(".gal-sub-title");
            const desc = thumbnail.querySelector(".gal-desc");
            var title = null;
            var titlelink = null;
            var sub = null;
            var sublink = null;
            var descOut = null;

            if (maintitle) 
            {
                title = maintitle.innerText || "Image Preview";
                titlelink = maintitle.getAttribute("href") || "";
            }
            if (subtitle) 
            {
                sub = subtitle.innerText || "";
                sublink = subtitle.getAttribute("href") || "";
            }
            if (desc) 
            {
                descOut = desc.innerText || "";
            }

            // Apply details to modal

            const Tmodal= document.getElementById("modal-title-text");
            const subTmodal = document.getElementById("modal-sub-title-text");
            
            Tmodal.innerText = title;
            if (titlelink) 
            {
                Tmodal.setAttribute("href",titlelink);
            }
            else
            {
                Tmodal.removeAttribute("href");
            }
            if (subtitle) 
            {
                subTmodal.innerText = sub;
            }
            else
            {
                subTmodal.innerText = "";
            }
            if (sublink) 
            {
                subTmodal.setAttribute("href", sublink);
            }
            else
            {
                subTmodal.removeAttribute("href");
            }
            
            if (descOut)
            {
                document.getElementById("description-section").classList.remove('d-none');
                document.getElementById("desc-content").innerText = descOut;
            }
            else
            {
                document.getElementById("description-section").classList.add('d-none');
            }
            $("#image-modal").modal("show");
        });
    });

    modal.addEventListener("hidden.bs.modal", () => {
        const elementInModal = modalBody.querySelector("canvas") || modalBody.querySelector("img");
        
        if (placeholder && elementInModal) {
            // 3. Put the element back where the placeholder is
            placeholder.parentNode.replaceChild(elementInModal, placeholder);
            
            // 4. Cleanup
            placeholder = null;
        }
        
        $("#image-modal").modal("hide");
    });
}

// 1. Trigger on initial DOM load
document.addEventListener("DOMContentLoaded", async => modalHandler());

// 2. Trigger on your custom event
document.addEventListener("pageTransitionFinished", async => modalHandler());