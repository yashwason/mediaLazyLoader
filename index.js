document.onload = setupImageLazyLoading();


function setupImageLazyLoading(){    
    const lazyloadImages = document.querySelectorAll(`img.lazy`);

    if(`IntersectionObserver` in window){
        const imageObserver = new IntersectionObserver(function(entries, observer){
            entries.forEach((entry) => {
                if(entry.isIntersecting){
                    console.log(entry.target);

                    changeElemAttributes(entry.target);
                    imageObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: `0px 0px 70% 0px` });
  
        lazyloadImages.forEach((image) => imageObserver.observe(image));
    }
    else{
        let lazyloadThrottleTimeout;
      
        function lazyload(){
            if(lazyloadThrottleTimeout) clearTimeout(lazyloadThrottleTimeout);
  
            lazyloadThrottleTimeout = setTimeout(() => {
                lazyloadImages.forEach((img) => {
                    if(img.offsetTop < (window.pageYOffset + (window.innerHeight * 1.7) )) changeElemAttributes(img);
                });

                if(lazyloadImages.length == 0){ 
                    document.removeEventListener("scroll", lazyload);
                    window.removeEventListener("resize", lazyload);
                    window.removeEventListener("orientationChange", lazyload);
                }
            }, 20);
        }

        document.addEventListener(`scroll`, lazyload);
        window.addEventListener(`resize`, lazyload);
        window.addEventListener(`orientationChange`, lazyload);
    }
}

function changeElemAttributes(img){
    if(img.dataset.src){
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        img.removeAttribute(`data-src`);
    }
}