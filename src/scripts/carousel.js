document.addEventListener('DOMContentLoaded', () => {
  const scenes = document.querySelectorAll('.carousel-scene');

  scenes.forEach(scene => {
    const spinner = scene.querySelector('.carousel-spinner');
    if (!spinner) return;

    const items = Array.from(spinner.children);
    if (items.length === 0) return;

    items.forEach(item => {
      item.classList.add('carousel-item');
    });

    const itemWidth = 340;
    
    // Auto-size the scene height based on content
    function sizeScene() {
      // Briefly un-position items so we can measure natural height
      items.forEach(item => {
        item.style.position = 'static';
        item.style.width = itemWidth + 'px';
        item.style.height = 'auto';
      });
      const tallestCard = Math.max(...items.map(i => i.offsetHeight));
      items.forEach(item => {
        item.style.position = '';
        item.style.width = '';
        item.style.height = '';
      });

      // Add extra top padding for dots
      const sceneHeight = Math.min(Math.max(tallestCard + 80, 300), 500);
      scene.style.height = sceneHeight + 'px';
      spinner.style.height = (sceneHeight - 80) + 'px';
      spinner.style.marginTop = '20px'; // Push spinner down to make room for dots
    }

    sizeScene();

    let activeIndex = 0;

    // Create pagination dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    const dots = [];
    items.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot';
      dot.addEventListener('click', () => {
        activeIndex = i;
        updateCarousel();
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
    scene.appendChild(dotsContainer);

    function updateCarousel() {
      items.forEach((item, i) => {
        let diff = i - activeIndex;
        const half = Math.floor(items.length / 2);
        
        // Normalize diff for wrap-around (circular carousel)
        if (diff > half) diff -= items.length;
        if (diff < -half) diff += items.length;
        
        // Calculate transforms for coverflow overlapping
        // 180px overlaps behind the front 340px card nicely
        const translateX = diff * 180; 
        const scale = 1 - Math.abs(diff) * 0.15; 
        const zIndex = 100 - Math.abs(diff);
        
        if (Math.abs(diff) > 2) {
          item.style.opacity = '0';
          item.style.pointerEvents = 'none';
          item.style.transform = `translateX(${Math.sign(diff) * 300}px) scale(0.5)`;
        } else {
          item.style.opacity = ''; // Let CSS handle opacity based on class
          item.style.transform = `translateX(${translateX}px) scale(${scale})`;
          
          if (diff === 0) {
            item.classList.add('active');
            item.style.pointerEvents = 'auto';
          } else {
            item.classList.remove('active');
            item.style.pointerEvents = 'none';
          }
        }
        item.style.zIndex = zIndex;
      });

      // Update dots state
      dots.forEach((dot, i) => {
        if (i === activeIndex) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }

    updateCarousel();

    // Auto Play — move to next card every 4 seconds
    let autoPlayInterval = setInterval(() => {
      activeIndex = (activeIndex + 1) % items.length;
      updateCarousel();
    }, 4000);

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(() => {
        activeIndex = (activeIndex + 1) % items.length;
        updateCarousel();
      }, 4000);
    }

    // Button controls
    const prevBtn = scene.querySelector('.carousel-prev');
    const nextBtn = scene.querySelector('.carousel-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        updateCarousel();
        resetAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        activeIndex = (activeIndex + 1) % items.length;
        updateCarousel();
        resetAutoPlay();
      });
    }

    // Touch / swipe support
    let startX = 0;
    scene.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    scene.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) {
        // Swipe left -> next
        activeIndex = (activeIndex + 1) % items.length;
        updateCarousel();
        resetAutoPlay();
      } else if (endX - startX > 50) {
        // Swipe right -> prev
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        updateCarousel();
        resetAutoPlay();
      }
    });

    // Re-size on window resize
    window.addEventListener('resize', () => {
      sizeScene();
      updateCarousel();
    });
  });
});
