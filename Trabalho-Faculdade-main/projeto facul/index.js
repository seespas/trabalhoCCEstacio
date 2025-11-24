const carouselTrack = document.querySelector('.carousel-track');
const carouselItems = document.querySelectorAll('.carousel-item');
let currentIndex = 0; 
const itemWidth = carouselItems[0].offsetWidth; 
const visibleItems = 3;

function centerSlide() {

    const containerWidth = carouselTrack.parentElement.offsetWidth;
    const itemFullWidth = carouselItems[0].offsetWidth; 
    carouselTrack.style.transform = `translateX(${-currentIndex * itemFullWidth}px)`;

    carouselItems.forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentIndex) {
            item.classList.add('active');
        }
    });

    const containerCenterOffset = containerWidth / 2; 
    const itemCenterOffset = itemFullWidth / 2; 

    const currentItemTheoreticalCenter = currentIndex * itemFullWidth + itemCenterOffset;

    const newTranslateX = containerCenterOffset - currentItemTheoreticalCenter;

    carouselTrack.style.transform = `translateX(${newTranslateX}px)`;

    carouselItems.forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentIndex) {
            item.classList.add('active');
        }
    });
}

function mudarSlide(n) {
    currentIndex += n;

    if (currentIndex >= carouselItems.length) {
        currentIndex = 0; 
    }
    if (currentIndex < 0) {
        currentIndex = carouselItems.length - 1;
    }

    centerSlide(); 
}

window.addEventListener('load', () => {
  
    currentIndex = 0;
   
    centerSlide();
});

window.addEventListener('resize', centerSlide);
