const categories = document.querySelector(".categories");
const trees = document.querySelector(".trees");
const cart = document.querySelector(".cart");

const displayTrees = (allTrees) => {
  trees.innerHTML = "";

  allTrees.forEach((tree) => {
    const treeDiv = document.createElement("div");
    treeDiv.classList.add('tree-card');
    treeDiv.innerHTML = `
        <div class="card bg-base-100 w-sm shadow-sm">
        <figure>
            <img src="${tree.image}" alt="${tree.name}" title="${tree.name}" />
        </figure>
        <div class="card-body">
            <h2 class="card-title">
                Card Title
                <div class="badge badge-secondary">NEW</div>
            </h2>
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            <div class="card-actions justify-end">
                <div class="badge badge-outline">Fashion</div>
                <div class="badge badge-outline">Products</div>
            </div>
        </div>
    </div>
        
        `;

        trees.appendChild(treeDiv);
  });
};

const loadTrees = async (categoryId) => {
  const url = `https://openapi.programming-hero.com/api/category/${categoryId}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.plants || data.plants.length === 0) {
    trees.innerHTML = `<p class="text-center text-lg font-semibold">No trees available for this category.</p>`;
    return;
  }

  displayTrees(data.plants);
};

// categories portion
const displayCategories = (allCategories) => {
  categories.innerHTML = "";
  const title = document.createElement("h2");
  title.classList.add("text-4xl", "font-bold", "mb-4", "text-center");
  title.innerText = "Categories";
  categories.appendChild(title);

  const Allbtn = document.createElement("button");
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
  Allbtn.addEventListener("click", () => loadTrees("all"));
  categories.appendChild(Allbtn);

  allCategories.forEach((category) => {
    const button = document.createElement("button");
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

// cart portion

loadCategories();
