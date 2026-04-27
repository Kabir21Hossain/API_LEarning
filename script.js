const categories = document.querySelector(".categories");
const trees = document.querySelector(".trees");
const cart = document.querySelector(".cart");
const cartBadge = document.getElementById('cart-badge');
const cartItemsContainer=document.querySelector(".cart-items");
const emptyCartMessage=document.querySelector('.empty-cart');
const pageLoader = document.getElementById('page-loader');
const treeLoader = document.getElementById('tree-loader');
const modal = document.getElementById('my_modal_1');
const modalContent = document.getElementById('modal-content');
let cartArray=[];

const viewDetails = (tree) => {
  if (!modalContent || !modal) {
    console.error('Modal content or dialog not found.');
    return;
  }

  modalContent.innerHTML = `
        <div class="card bg-base-100 w-full shadow-sm">
          <figure>
            <img src="${tree.image}" alt="${tree.name}" title="${tree.name}" class="w-full h-64 object-cover" />
          </figure>
          <div class="card-body border-t-rounded-lg">
            <h2 class="card-title text-2xl font-bold hover:text-green-500">
              ${tree.name}
            </h2>
            <p class="">${tree.description}</p>
            <p class="text-lg font-semibold border-2 border-green-500 text-green-500 px-2 py-1 rounded-lg">${tree.category}</p>
            <div class="card-actions justify-between items-center mt-4">
              <span class="text-xl font-bold text-green-500">$${tree.price}</span>
              <button type="button" class="addToCartBtn btn btn-soft text-green-500 hover:bg-green-200">Add to Cart</button>
            </div>
          </div>
        </div>
    `;

  const addToCartBtn = modalContent.querySelector('.addToCartBtn');
  addToCartBtn?.addEventListener('click', () => addToCart(JSON.stringify(tree)));

  modal.showModal();
};

const showLoader = () => {
  pageLoader?.classList.remove('hidden');
  treeLoader?.classList.remove('hidden');
};

const hideLoader = () => {
  pageLoader?.classList.add('hidden');
  treeLoader?.classList.add('hidden');
};

const removeFromCart=(itemId)=>{
  const itemIndex=cartArray.findIndex(item=>item.id===itemId);
  if(itemIndex!==-1){
    if(cartArray[itemIndex].quantity>1){
      cartArray[itemIndex].quantity-=1;
    } else {
      cartArray.splice(itemIndex, 1);
    }
    updateCartUI();
  }
};

const updateCartUI=()=>{
  const totalCount = cartArray.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) {
    cartBadge.textContent = totalCount;
  }

  if(cartArray.length===0){
    emptyCartMessage.classList.remove('hidden');
    cartItemsContainer.innerHTML = "";
    document.getElementById('total-price').innerText = '$0.00';
  } else {
    emptyCartMessage.classList.add('hidden');
    cartItemsContainer.innerHTML="";
    cartArray.forEach(item=>{
      const itemDiv=document.createElement("div");
      itemDiv.classList.add("cart-item", "flex", "justify-between", "items-center", "mb-2",'shadow-xl', 'p-2', 'rounded-lg','bg-gray-100');
      itemDiv.innerHTML=`
      <div class="flex flex-col items-center space-y-2">
        <span class="font-semibold text-2xl">${item.name}</span>
        <span class="text-lg font-bold">$${item.price}x${item.quantity}</span>

      </div>

      <div class="flex flex-col items-center space-y-5">
        <span class="font-semibold text-2xl btn btn-error btn-soft" onclick="removeFromCart(${item.id})">x</span>
        <span class="text-lg font-bold">$${item.price}x${item.quantity}</span>

      </div>

      
      
      `;
      cartItemsContainer.appendChild(itemDiv);
    });
    document.getElementById('total-price').innerText=`Total:$${cartArray.reduce((total,item)=>total+item.price*item.quantity,0)}`;
  }
}

const addToCart = (treeJson) => {
  const tree=JSON.parse(treeJson);
  console.log(tree);
  const existingItem = cartArray.find(item => item.id === tree.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartArray.push({ ...tree, quantity: 1 });
  }
  
  updateCartUI();
};

const displayTrees = (allTrees) => {
  if (!trees) {
    console.error('Tree container not found.');
    return;
  }

  trees.innerHTML = "";

  allTrees.forEach((tree) => {
    const treeDiv = document.createElement("div");
    treeDiv.classList.add('tree-card');
    treeDiv.innerHTML = `
        <div class="card bg-base-100 w-50 max-h-200 shadow-sm">
          <figure>
            <img src="${tree.image}" alt="${tree.name}" title="${tree.name}" class="w-full h-64 object-cover" />
          </figure>
          <div class="card-body border-t-rounded-lg">
            <h2 class="card-title text-2xl font-bold hover:text-green-500">
              ${tree.name}
            </h2>
            <p class="line-clamp-2 overflow-hidden text-ellipsis">${tree.description}</p>
            <p class="text-lg font-semibold border-2 border-green-500 text-green-500 px-2 py-1 rounded-lg">${tree.category}</p>
            <div class="card-actions justify-between items-center mt-4">
              <span class="text-xl font-bold text-green-500">$${tree.price}</span>
              <div class="flex gap-2">
                <button type="button" class="view-details-btn btn btn-ghost btn-sm">View</button>
                <button type="button" class="addToCartBtn btn btn-soft btn-sm text-green-500 hover:bg-green-200">Add</button>
              </div>
            </div>
          </div>
        </div>
    `;

    trees.appendChild(treeDiv);
    const addToCartBtn = treeDiv.querySelector(".addToCartBtn");
    const viewDetailsBtn = treeDiv.querySelector(".view-details-btn");
    addToCartBtn.addEventListener("click", () => addToCart(JSON.stringify(tree)));
    viewDetailsBtn.addEventListener("click", () => viewDetails(tree));
  });
};



const setActiveButton = (categoryId) => {
  const allBtns = document.querySelectorAll(".categories .btn");
  allBtns.forEach((btn) => btn.classList.remove("bg-green-500", "text-white"));
  const activeBtn = document.getElementById(categoryId);
  if (activeBtn) activeBtn.classList.add("bg-green-500", "text-white");
};

const loadTrees = async (categoryId) => {
  setActiveButton(categoryId);
  showLoader();
  trees.innerHTML = "";

  const url = categoryId === "all"
    ? "https://openapi.programming-hero.com/api/plants"
    : `https://openapi.programming-hero.com/api/category/${categoryId}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.plants || data.plants.length === 0) {
      trees.innerHTML = `<p class="text-center text-lg font-semibold">No trees available for this category.</p>`;
      return;
    }

    hideLoader();
    displayTrees(data.plants);
  } catch (error) {
    trees.innerHTML = `<p class="text-center text-lg font-semibold text-red-500">Failed to load trees. Please try again.</p>`;
    console.error('Tree loading error:', error);
  } finally {
    hideLoader();
  }
};

// categories portion
const displayCategories = (allCategories) => {
  categories.innerHTML = "";
  const title = document.createElement("h2");
  title.classList.add("text-4xl", "font-bold", "mb-4", "text-center");
  title.innerText = "Categories";
  categories.appendChild(title);

  const Allbtn = document.createElement("button");
  Allbtn.id='all';
  Allbtn.classList.add(
    "btn",
    "btn-soft",
    "m-2",
    "text-lg",
    "font-bold",
    "px-4",
    "py-4",
    "border-1",
    "outline-1",
  );
  Allbtn.innerText = "All Trees";
  // add event listener to this button
  categories.appendChild(Allbtn);

  Allbtn.addEventListener("click", () => loadTrees('all'));

  allCategories.forEach((category) => {
    const button = document.createElement("button");
    button.id=category.id;
    button.classList.add(
      "btn",
      "btn-soft",
      "m-2",
      "text-lg",
      "font-bold",
      "px-4",
      "py-4",
      "border-1",
      "outline-1",
    );
    button.innerText = category.category_name;
    // add event listener to each button
    categories.appendChild(button);
    button.addEventListener("click", () => loadTrees(category.id));
  });
};

const loadCategories = async () => {
  const url = "https://openapi.programming-hero.com/api/categories";
  const res = await fetch(url);
  const data = await res.json();
  displayCategories(data.categories);
};




  
const init = async () => {
  await loadCategories();
  await loadTrees('all');
};

init();

