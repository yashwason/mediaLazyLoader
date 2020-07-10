import Glide from '@glidejs/glide';

document.onload = setupLazyLoading();


function setupLazyLoading(){    
    const elemsWithResourcesToLazyLoad = document.querySelectorAll(`.lazy`);

    if(`IntersectionObserver` in window){
        const lazyElemObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if(entry.isIntersecting){
                    changeElemAttributes(entry.target);
                    lazyElemObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: `0px 0px 70% 0px` });
  
        elemsWithResourcesToLazyLoad.forEach((elem) => lazyElemObserver.observe(elem));
    }
    else{
        let lazyloadThrottleTimeout;
      
        function lazyload(){
            if(lazyloadThrottleTimeout) clearTimeout(lazyloadThrottleTimeout);
  
            lazyloadThrottleTimeout = setTimeout(() => {
                elemsWithResourcesToLazyLoad.forEach((elem) => {
                    if(elem.offsetTop < (window.pageYOffset + (window.innerHeight * 1.7) )) changeElemAttributes(elem);
                });

                if(elemsWithResourcesToLazyLoad.length === 0){ 
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

function changeElemAttributes(elem){
    /*
    removing lazy class, because elements with this class will go through all this lazy loading cycle, and that will fail
    because we would have removed the 'data-src' and 'data-srcset' attributes in a previous trigger (as resource would have loaded already)
    */
    elem.classList.remove(`lazy`);

    // making sure child <img> and <source> elements don't have this class too. else same problem that's stated in above comment
    // const childLazyElems = elem.querySelectorAll(`.lazy`);
    // if(childLazyElems && childLazyElems.length){
    //     childLazyElems.forEach((childElem) => childElem.classList.remove(`lazy`));
    // }

    
    changeSrcAndSrcsetAttr(elem); // changing data-src to src and data-srcset to srcset
    if(elem.dataset.posterSrc) useThenRemoveDataAttribute(elem, `poster`, elem.dataset.posterSrc, `data-poster-src`);
    if(elem.dataset.lazyAutoplay && (elem.tagName.toLowerCase() === `video` || elem.tagName.toLowerCase() === `audio`)) elem.play();
    

    // needed for picture, audio and video elements and also sliders and carousels (via JS libraries) that have <source> and <img> as children
    const childSOURCEElems = elem.querySelectorAll(`source`),
        childIMGElems = elem.querySelectorAll(`img`);

    if(childIMGElems.length) childIMGElems.forEach((IMGElem) => changeSrcAndSrcsetAttr(IMGElem));
    if(childSOURCEElems.length) childSOURCEElems.forEach((SOURCEElem) => changeSrcAndSrcsetAttr(SOURCEElem));
}


function useThenRemoveDataAttribute(elem, attr, dataAttr, attrName){
    elem.setAttribute(attr, dataAttr);
    elem.removeAttribute(attrName);
}

function changeSrcAndSrcsetAttr(elem){
    if(elem.dataset.src) useThenRemoveDataAttribute(elem, `src`, elem.dataset.src, `data-src`);
    if(elem.dataset.srcset) useThenRemoveDataAttribute(elem, `srcset`, elem.dataset.srcset, `data-srcset`);
}


new Glide('.slider', {
    type: 'slider',
    perView: 4.5,
    gap: `25px`,
    focusAt: 0,
    startAt: 0,
    autoplay: 3000
}).mount();