let categorie = document.querySelector(".main-left-top");
let SeeMoreBtn = document.querySelectorAll(".SeeMore-button button");
let allpara = document.querySelectorAll(".main-left-top p");
let quickView = document.querySelectorAll(".book");
let allBooks=document.querySelectorAll(".book-container")
let loader=document.querySelector(".loader");
let err=document.querySelector(".loader h1");
let imgload=document.querySelector(".imgLoader")
// err.style.display="none";

async function fetchCategory() {
  let data = await fetch(
    " https://books-backend.p.goit.global/books/category-list"
  );
  let result = await data.json();
  appendCategoryList(result);
}

function appendCategoryList(result) {

  result.forEach((element) => {
    let para = document.createElement("p");
    para.innerText = element.list_name;
    categorie.appendChild(para);
    allpara = document.querySelectorAll(".main-left-top p");
    eventOnCategory();
  });
}
fetchCategory();

document
  .querySelector(".main-left-top h1")
  .addEventListener("click", fetchBook);

async function fetchBook() {
  try {
    let url=" https://books-backend.p.goit.global/books/top-books"
    let data = await fetch(url);
    if (!data.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
  }
    let result = await data.json();
    loader.style.display="none"
    categoryResult(result);
  } catch (error) {
    imgload.style.display="none"
    err.style.display="block";
  }
  
}
fetchBook();

// Funtion to Loop on categories
function categoryResult(result) {
  result.forEach((element) => {
    let bookContainer = document.createElement("div");
    bookContainer.classList.add("all-book-container");
    bookContainer.innerHTML = `
        <h4>${element.list_name}</h4>
        `;

    books(element.books, bookContainer);
  });
}

function books(bookArray, bookContainer) {
  let div1 = document.createElement("div");
  div1.classList.add("allBooks");

  bookArray.forEach((ele) => {
    let bookimg = ele.book_image;
    let authorName = ele.author;
    let bookTitle = ele.title;
    let bookCategory = ele.list_name;
    let idofBook=ele._id;
    // console.log(idofBook);

    let div2 = document.createElement("div");
    div2.classList.add("book-container");
    div2.innerHTML = `
                    <div class="book">
                        <img src=${bookimg} alt="">
                        <div class="hoverText animate__animated ">
                            QuickView
                        </div>
                    </div>
                    <h5>${bookTitle}</h5>
                    <h6>${authorName}</h6>
                    <span class="idofBook">${idofBook}</span>
                
            `;
    div1.appendChild(div2);
    allBooks=document.querySelectorAll(".book-container")
    eventOnBook(allBooks);
    QuickView();
    QuickViewRemove();
  });
  bookContainer.appendChild(div1);

  let btnDiv = document.createElement("div");
  btnDiv.classList.add("SeeMore-button");
  btnDiv.innerHTML = `<button class="btn41-43 btn-41">See More</button>`;
  bookContainer.appendChild(btnDiv);
  document.querySelector(".right-main").appendChild(bookContainer);

  SeeMoreBtn = document.querySelectorAll(".SeeMore-button button");
  seeMoreButton();
}


function eventOnBook(allBooks){
  allBooks.forEach(ele=>{
    ele.addEventListener("click",eventOnBook2);
  })
}
async function eventOnBook2(e){
  let categoryForPopup=e.target.parentElement.parentElement.children[3].innerText;
  let data=await fetch(`https://books-backend.p.goit.global/books/${categoryForPopup}`);
  let res=await data.json();
  console.log(res);
  bImg=res.book_image;
  bauth=res.author;
  bTitle=res.title;
  bDescription=res.description;
  console.log(bDescription);
  amazonLink=res.buy_links[0].url;
  buyLink2=res.buy_links[1].url;

  let popWin=document.createElement("div");
  popWin.classList.add("popUp");
  popWin.innerHTML=

  `
            <i>close</i>
            <div class="popup-top">
                <img src=${bImg} alt="">
                <div class="detail">
                    <h3>${bTitle}</h3>
                    <h5>${bauth}</h5>
                    <p class="description">${bDescription}</p>
                    <div class="logo">
                        <a href=${amazonLink}><i class="fa-brands fa-amazon"></i></a>
                        <a href=${buyLink2}><i class="fa-solid fa-book-open"></i></a>
                    </div>
                </div>
            </div>
            <div class="popup-bottom">
                <button class="addToCart">ADD TO SHOPPING LIST</button>
            </div>
  `
  document.querySelector(".popSection").replaceChildren(popWin);
  popWin.style.display="flex"
  closePopup(document.querySelector(".popUp i"),popWin);
}

function closePopup(closepopbtn,popWin){
closepopbtn.addEventListener("click",()=>{
  popWin.style.display="none"
})
}

function seeMoreButton() {
  SeeMoreBtn.forEach((ele) => {
    ele.addEventListener("click", eventOnBtn);
  });
}

async function eventOnBtn(e, newData) {
  let newFetch = "";
  if (newData == undefined) {
    newFetch = e.target.parentElement.parentElement.children[0].innerText;
  } else {
    newFetch = newData;
  }
  let data = await fetch(
    `https://books-backend.p.goit.global/books/category?category=${newFetch}`
  );
  let result = await data.json();
  appendSeeMoreData(result);
}

let right_main = document.querySelector(".right-main");

// Append More data on clicking See more button
function appendSeeMoreData(moreBooksArray) {
  let heading = document.createElement("h1");
  heading.classList.add("heading");

  heading.innerText = moreBooksArray[0].list_name;
  right_main.replaceChildren(heading);

  let bookContainer = document.createElement("div");
  bookContainer.classList.add("all-book-container");
  books(moreBooksArray, bookContainer);
  for (let i = 0; i < SeeMoreBtn.length; i++)
    SeeMoreBtn[i].style.display = "none";
    
  QuickView();
  QuickViewRemove();
}

function eventOnCategory() {
  allpara = document.querySelectorAll(".main-left-top p");

  allpara.forEach((ele) => {
    ele.addEventListener("click", catEvent);
  });
}

function catEvent(e) {
  eventOnBtn(e, e.target.innerText);
}

// Quick view DIsplay and HIde on hover
function QuickView() {
  quickView = document.querySelectorAll(".book");
  quickView.forEach((ele) => {
    ele.addEventListener("mouseover", quickViewEvent);
  });
}

function quickViewEvent(e) {
  let quick = e.target.parentElement.children[1];
  quick.classList.add("animateQuick");
  //   quick.classList.remove("removeAnimate")
  // quick.style.bottom="50px"
}

function QuickViewRemove() {
  quickView = document.querySelectorAll(".book");
  quickView.forEach((ele) => {
    ele.addEventListener("mouseout", removeQuickViewEvent);
  });
}

function removeQuickViewEvent(e) {
  quickView = document.querySelectorAll(".book");
  let quick = e.target.parentElement.children[1];
  quick.classList.remove("animateQuick");
  // quick.classList.add("removeAnimate")
}

//   SignUp PAge
let wholeLoginPg = document.querySelector(".login");
let mainContainer = document.querySelector(".main");
let signUpCard = document.querySelector(".form_input");
let signUpTopBtn = document.querySelector(".button");

signUpTopBtn.addEventListener("click", () => {
  signUpCard.classList.add("animate__zoomInLeft");
  mainContainer.style.display = "none";
  wholeLoginPg.style.display = "flex";

});
let login2 = document.querySelector(".loginInToACC");
let signIn = document.querySelector(".signin");
signIn.addEventListener("click", () => {
  login2.style.display = "flex";
  login2.classList.add("animate__bounceIn");
  signUpCard.style.display = "none";
  signIn.style.borderBottom="2px solid red"
  signup2.style.borderBottom="none"
});

let signup2 = document.querySelector(".signUp2");
signup2.addEventListener("click", () => {
  login2.style.display = "none";
  login2.classList.remove("animate__bounceIn");
  signUpCard.style.display = "flex";
  signup2.style.borderBottom="2px solid red"
  signIn.style.borderBottom="none"
});

let close = document.querySelector(".loginCard i");
close.addEventListener("click", () => {
  mainContainer.style.display = "flex";
  wholeLoginPg.style.display = "none";
});
let toggle = document.querySelector(".toggel-outer");
let innerToggl = document.querySelector(".toggel-inner");
// let darktheme=document.querySelector(".r")

toggle.addEventListener("click", () => {
  innerToggl.classList.toggle("toggl");
  document.body.classList.toggle("r");
  // rootEle.style.setProperty(--bgcolor, black);
  // rootEle.style.setProperty( --textColor, white);
  // rootEle.style.setProperty(--bgcolor, black);
  // rootEle.style.setProperty(--bgcolor, black);
});
