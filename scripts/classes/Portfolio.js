import MediaApi from "../Api/MediaApi.js";
import PhotographerApi from "../Api/PhotographerApi.js";

import MediaFactory from "./MediaFactory.js";

import PhotographerBanner from '../templates/PhotographerBanner.js'

import Photographer from './Photographer.js';
import LightBox from './LightBox.js';

import ContactForm from "../utils/ContactForm.js";
class Portfolio 
{
    constructor (id) 
    {
        this.id = id;
        this.main = document.querySelector('#main');
        this.mainContent = document.getElementById('photographer-gallery');
        this.mediasApi = new MediaApi('data/profilData.json');
        this.photographersApi = new PhotographerApi('data/profilData.json'); // Fetch data with API
        this.all = []; 
        this.totalLikes = 0;

        // Drop down elements
        this.button = document.querySelector(".dropDownBtn");
        this.buttonWrap = document.querySelector('.dropDownMenu__button-wrapper');
        this.dropDownList = document.querySelector(".dropDownList");
        this.arrow = document.getElementById("chevron-icon");
        this.selectOptions =
        {
            likes: 'Popularity',
            date: 'Date',
            title: 'Title'
        }
        this.nameOption = this.button.innerText.toLowerCase();
        this.dropDownOverlay = document.querySelector('.menu-overlay');
    }

    async hydrate() 
    {
        const mediasData = await this.mediasApi.getMedias();
        const items = mediasData.filter(item => item.photographerId === this.id)
        
        // Get media
        items.forEach(item => 
            {
                let media = new MediaFactory(item); // to sort everything out
                this.all.push(media)
            });

        const photographersData = await this.photographersApi.getPhotographersItems();
        const photographerItems = photographersData.find(photographer => photographer.id == this.id);
        this.photographer = new Photographer(photographerItems)

        // Get the whole banner (photographer info + contact form)
        const bannerSection = new PhotographerBanner(this.photographer)
        this.main.prepend(bannerSection.renderBanner())
        const form = new ContactForm(this.photographer); 
        form.start();   

    }
    // Display media gallery 
    displayGallery()
    {
        let html = ''
        this.all.forEach(media => // Create a loop
        {
            html += media.render(); // render() is from Picture.js and Video.js
        })

        document.querySelector('#photographer-gallery').innerHTML = html
    }

    // Display card info (total likes, price)
    displayInsertCard() 
    {  
        let cardInsertInfos = `
            <div class="card-insert__counter sr-container">
                <span class="card-insert__total-likes">${this.totalLikes}</span>
                <span aria-hidden="true" class="card-insert__icon fas fa-heart"></span>
            </div>
            <div class="card-insert__price">
                <p>${this.photographer.price}€ / jour</p>
            </div>
        </aside>
            `;
        document.querySelector('.card-insert').innerHTML = cardInsertInfos;

    }

    // -------------------- LIKE BUTTON --------------------- //

    // Update the total count of likes
    countTotalLikes() 
    {
        this.totalLikes = 0;
        this.all.forEach( (media) => 
            {
            this.totalLikes += media.likes
            });

            return this.totalLikes;

    }

    // Add event listener for the number of likes
    listenLikes()
    {
        this.all.forEach( (media) => // Create a loop
        {
            document.querySelector(`.media-cards[data-id="${media.id}"] .toggleButton`).addEventListener('click', ()=> 
            {
                media.toggle();
                this.countTotalLikes();
                document.querySelector('.card-insert__total-likes').innerHTML = this.totalLikes;
            });
        });
      
    }

    // -------------------- DROP DOWN MENU --------------------- //

    // Show drop down menu options, while hide the button, when user clicks
    showOptions()
    {
        this.arrow.style.WebkitTransform = "rotate(-180deg)"; // Rotate the chevron when click on the button
        this.button.setAttribute("aria-expanded", "true"); // Set aria-expanded for accessibility purpose
        this.dropDownList.style.display = "block"; // Show the options when clicked
        this.dropDownList.setAttribute("aria-activedescendant", this.nameOption);
        this.button.style.display = "none";
        this.dropDownList.focus();
        
    }

    // Hide options and show button alone
    hideOptions()
    {
        this.arrow.style.WebkitTransform = "rotate(0deg)"; // Chevron down when option list are hidden
        this.button.setAttribute("aria-expanded", "false");
        this.dropDownList.removeAttribute("aria-activedescendant");
        this.dropDownList.style.display = "none"; // Hide options
        this.button.style.display = "block";
        this.button.focus();
    }

    listenForReordering()
    {   
        // Add event listener to roll down the options when clicked on the button
        this.buttonWrap.addEventListener('click', (event) => // listen sort on click
        {
            event.stopPropagation();
            this.showOptions(); // Show drop down menu options (popularity, title, date)
        })
    }

    // Close drop down with click on main
    closeClickOnMain()
    {
        this.dropDownOverlay.addEventListener("click", (event) => 
        {
            if (event.target === this.dropDownOverlay) 
            {
                event.stopPropagation();
                event.preventDefault();
                this.hideOptions();
            }
            
        });
    }

    // Button with Keydown Event (accessibility)
    focusOnKeydown()
    {
        this.buttonWrap.addEventListener("click", (event) =>
        {
            if (document.activeElement === this.buttonWrap) {
                if (event.key === "ChevronDown" || event.key === "ChevronUp" || event.key === "Enter") {
            event.preventDefault();
            this.showOptions();
                }
            }
        });
    }   

    display()
    {
        this.displayReorderList();
        this.displayGallery();
        this.displayInsertCard();
    }

    // Update order when the option is clicked and activated
    showCurrentOrder(order)
    {
        document.querySelector('.dropDownMenu__button-wrapper .sort-option').innerHTML = this.selectOptions[order];
    }

    
    // Display Drop Down Menu
    displayReorderList()
    {   // .sort-option (class for all the buttons)
        document.querySelector('.sort-option').innerHTML = this.selectOptions["likes"];
        this.listenForReordering();
        this.listenForOptions();
        this.focusOnKeydown();
    }

    reorderByDate(a,b)
    {
        const valueA = new Date(a.date);
        const valueB = new Date(b.date);
        return valueB - valueA;
    }

    reorderByTitle(a,b)
    {
        const valueA = a.title;
        const valueB = b.title;
        if (valueA < valueB) {
            return -1;
          } else if (valueA === valueB) {
            return 0;
          } else {
            return 1;
          }
    }

    reorderByPopularity(a,b)
    {
        const valueA = parseInt(a.likes);
        const valueB = parseInt(b.likes);
        return valueB - valueA;
    }

    // To sort out the different options in the drop down menu: title, date and popularite (sets as default)
    reorder(order)
    {
            switch (order)
            {

                // Case of sorting out medias by the 'date'
                case 'date':
                this.all = this.all.sort(this.reorderByDate);
                break;
        
                // Case of sorting out medias by the 'title'
                case 'title':
                this.all = this.all.sort(this.reorderByTitle);
                break;

                // Case of sorting out medias by the most popular one (from the highest to the lowest number of likes)
                default:
                this.all = this.all.sort(this.reorderByPopularity);
                
            }
    }

     // Lightbox function
     listenLightBox()
     {
         this.all.forEach((media, index) =>  
         {
             document.querySelector(`.media-cards[data-id="${media.id}"] .media-cards__lightbox-link`).addEventListener('click', () =>
             {
             new LightBox(this.all, index);
             });
         });
     }
    
    // Event listener when clicked on one option in the drop down menu
    listenForOptions()
    {
        document.querySelectorAll(".sort-list").forEach((option) =>
        {
            option.addEventListener('click', () => // When clicked on an option
            {
                const order = option.dataset.sort; // Set the order with dataset
                this.showCurrentOrder(order); // Reboot the order
                this.hideOptions(); // Hide options
                this.reorder(order); // Sort medias out
                this.displayGallery(); // Display the media gallery of the given photographer
                this.listenLikes(); // And listen again the likes (because listeners disappeared)
                this.listenLightBox(); 
            }); 
        });
    }


    // Async function to start the whole portfolio 
    async start()
    {
        await this.hydrate();
        this.countTotalLikes();
        this.display();
        this.listenLikes(); 
        this.listenForReordering(); 
        this.listenLightBox();  
    }
     
}

export default Portfolio;