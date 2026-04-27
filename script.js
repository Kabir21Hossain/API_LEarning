const categories=document.querySelector('.categories');
const trees=document.querySelector('.trees');
const cart=document.querySelector('.cart');

// categories portion
const displayCategories=allCategories=>{
    categories.innerHTML='';
    const title=document.createElement('h2');
    title.classList.add('text-4xl','font-bold','mb-4','text-center');
    title.innerText='Categories';
    categories.appendChild(title);

    
    allCategories.forEach(category=>{
        const button=document.createElement('button');
        button.classList.add('btn','btn-soft','m-2','text-lg','font-bold','px-4','py-4','border-1','outline-1');
        button.innerText=category.category_name;
        // add event listener to each button

        categories.appendChild(button);
    });
}

const loadCategories=async()=>{
    const url='https://openapi.programming-hero.com/api/categories';
    const res=await fetch(url)
    const data=await res.json();
    console.log(data.categories);
    displayCategories(data.categories);
    }


// cart portion


loadCategories();