import pets, { Pet } from "./pets"

document.addEventListener("DOMContentLoaded", () => {
    const petGallery = document.getElementById("pet-gallery")
    if (!petGallery) {
        return
    }
    petGallery.innerHTML = pets.map((pet: Pet) => {
        return `<div class="pet-item" tabindex="0">
                <img src="images/${pet.src}" alt="${pet.alt}">
            </div>`
    }).join('')

    document.addEventListener("click", petClicked)
    document.addEventListener("keydown", petKeyDown)
})


// maybe this should be in a closure instead of a module level variable
let focused: HTMLElement | null

function togglePetFocus(targetPetElement: HTMLElement) {
    if (focused) {
        focused.classList.remove("expand");
    }
    if (targetPetElement === focused) {
        focused = null;
    } else {
        targetPetElement.classList.add("expand");
        focused = targetPetElement;

        const handleScroll = () => {
            // Ensure 'focused' is up-to-date if you set it after the transition
            // For this logic, petElement is the one we want to scroll to.
            if (targetPetElement) { // Check if petElement is still valid (it should be)
                targetPetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        };

        // Listen for the transition to end on the petElement
        // The { once: true } option automatically removes the event listener after it fires once.
        targetPetElement.addEventListener('transitionend', handleScroll, { once: true });

    }
}


function petClicked(e: Event) {
    if (!(e.target instanceof HTMLElement)) {
        // If e.target is null, undefined, or an EventTarget that isn't an HTMLElement, bail out.
        return;
    }
    // Now, TypeScript knows e.target is an HTMLElement.
    // It cannot be null or undefined at this point.
    const clickedElement: HTMLElement = e.target; // e.target is now correctly typed as HTMLElement

    console.log(clickedElement);

    let petElement: Element | null = null;

    if (clickedElement.classList.contains("pet-item")) {
        petElement = clickedElement;
    } else {
        petElement = clickedElement.closest(".pet-item");
    }

    if (!petElement) {
        return;
    }

    e.preventDefault();
    togglePetFocus(petElement as HTMLElement); // Cast needed if petElement is Element
}

function petKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
        if (e.target instanceof HTMLElement) {
            const currentPetElement = e.target.classList.contains("pet-item") ?
                e.target : e.target.closest(".pet-item")
            if (currentPetElement) {
                togglePetFocus(currentPetElement as HTMLElement)
                e.preventDefault(); // Prevent space from scrolling the page
            }
        }
    }
}