// Little click animation

const addBtns = document.querySelectorAll(".add-btn");
const bag = document.querySelector(".backet");
const orderBtn = document.querySelector(".order-btn");
const addressOverlay = document.querySelector(".address-overlay");
const bodyOverlay = document.querySelector(".black-overlay");
const closeBtn = document.querySelector(".close-btn");

addBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    bag.classList.add("added");
    setTimeout(() => {
      bag.classList.remove("added");
    }, 1500)
  })
})



// Year

let currentDate = new Date().getFullYear();
document.querySelector(".year").innerHTML = currentDate;



// To the top
const topLink = document.querySelector('.top-link');

window.addEventListener('scroll', function(){
  const scrollHeight = window.pageYOffset;

  if(scrollHeight > 500) {
    topLink.classList.add('show-link');
  } else {
    topLink.classList.remove('show-link');
  }
})




// Order tab

orderBtn.addEventListener("click", ()=> {
  addressOverlay.style.display = "block";
  bodyOverlay.style.display = "block";
})

closeBtn.addEventListener("click", ()=>{
  addressOverlay.style.display = "none";
  bodyOverlay.style.display = "none";
})
