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
    elem.classList.remove(`lazy`);

    const childLazyElems = elem.querySelectorAll(`.lazy`);
    if(childLazyElems && childLazyElems.length){
        childLazyElems.forEach((childElem) => childElem.classList.remove(`lazy`));
    }

    
    changeSrcAndSrcsetAttr(elem);
    
    const childSOURCEElems = elem.querySelectorAll(`source`),
        childIMGElems = elem.querySelectorAll(`img`);

    if(childIMGElems.length) childIMGElems.forEach((IMGElem) => changeSrcAndSrcsetAttr(IMGElem));
    if(childSOURCEElems.length) childSOURCEElems.forEach((SOURCEElem) => changeSrcAndSrcsetAttr(SOURCEElem));
}

function useThenRemoveDataAttribute(elem, attr, dataAttr){
    elem.setAttribute(attr, dataAttr);
    elem.removeAttribute(dataAttr);
}

function changeSrcAndSrcsetAttr(elem){
    if(elem.dataset.src) useThenRemoveDataAttribute(elem, `src`, elem.dataset.src);
    if(elem.dataset.srcset) useThenRemoveDataAttribute(elem, `srcset`, elem.dataset.srcset);
}