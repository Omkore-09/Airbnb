// main.js

document.addEventListener('DOMContentLoaded', () => {
    const listingsContainer = document.querySelector('.row.row-cols-lg-3');
    const taxSwitch = document.getElementById("flexSwitchCheckDefault");
  
    // Function to fetch listings based on category
    function fetchListings(category) {
      fetch(`/listings?category=${category}`)
        .then(response => response.json())
        .then(data => {
          listingsContainer.innerHTML = ''; // Clear existing listings
          data.forEach(listing => {
            const listingDiv = document.createElement('a');
            listingDiv.href = `/listings/${listing._id}`;
            listingDiv.className = 'listing-link';
            listingDiv.innerHTML = `
              <div class="card col listing-card">
                <img src="${listing.image.url}" class="card-img-top" alt="listing_image" style="height: 20rem" />
                <div class="card-img-overlay"></div>
                <div class="card-body">
                  <p class="card-text">
                    <b>${listing.title}</b> <br />
                    &#8377; ${listing.price.toLocaleString("en-IN")} / night
                    <i class="tax-info"> &nbsp; &nbsp;+ 18% GST</i>
                  </p>
                </div>
              </div>
            `;
            listingsContainer.appendChild(listingDiv);
          });
        })
        .catch(error => console.error('Error fetching listings:', error));
    }
  
    // Event listener for filter buttons
    document.querySelectorAll('.filter').forEach(filter => {
      filter.addEventListener('click', () => {
        const category = filter.getAttribute('data-category');
        fetchListings(category);
      });
    });
  
    // Tax switch functionality
    taxSwitch.addEventListener("click", () => {
      let taxInfo = document.getElementsByClassName("tax-info");
      for (let info of taxInfo) {
        info.style.display = taxSwitch.checked ? "inline" : "none";
      }
    });
  });
  
