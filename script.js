const imageData = {
    astronaut: {
      plain: "https://static.wixstatic.com/media/c1e745_163c863286174439bd13dac765a7271f~mv2.png",
      color: "https://static.wixstatic.com/media/c1e745_38d3da77690d4ef79f69f54b06fcab40~mv2.png",
      link: "https://www.cocooncotton.com/product-page/cocoon-cotton-kids-astronaut-coloring-t-shirt-2-years-to-13-years"
    },
    unicorn: {
      plain: "https://static.wixstatic.com/media/c1e745_ce44bf60210741e8b20cafcd14951be3~mv2.png",
      color: "https://static.wixstatic.com/media/c1e745_1704dd5df8744776be4cc35e66d9a483~mv2.png",
      link: "https://www.cocooncotton.com/product-page/cocoon-cotton-kids-unicorn-coloring-t-shirt-2-years-to-13-years"
    },
    fairy: {
      plain: "https://static.wixstatic.com/media/c1e745_968026ae14ae41b9879150bbd8c6a749~mv2.png",
      color: "https://static.wixstatic.com/media/c1e745_e05649226e5e44fc996569a0028ac571~mv2.png",
      link: "https://www.cocooncotton.com/product-page/cocoon-cotton-kids-fairy-coloring-t-shirt-2-years-to-13-years"
    },
    dinosaur: {
      plain: "https://static.wixstatic.com/media/c1e745_777c7333777347ba8f813401b6a1ec02~mv2.png",
      color: "https://static.wixstatic.com/media/c1e745_070b1c20349d465d88a3162f2b1bac67~mv2.png",
      link: "https://www.cocooncotton.com/product-page/cocoon-cotton-kids-dinosaur-coloring-t-shirt-2-years-to-13-years"
    },
    animals: {
      plain: "https://static.wixstatic.com/media/c1e745_b5f0608fae364a7197aca8f3b0106024~mv2.png",
      color: "https://static.wixstatic.com/media/c1e745_92c5a5d148384eec941fbc1905578897~mv2.png",
      link: "https://www.cocooncotton.com/product-page/cocoon-cotton-kids-jungle-animals-coloring-t-shirt-2-years-to-13-years"
    }
  };
  
  let selectedProduct = null;
  let plainImg = new Image();
  let colorImg = new Image();
  plainImg.crossOrigin = "anonymous";
  colorImg.crossOrigin = "anonymous";
  
  const topCanvas = document.getElementById('topCanvas');
  const bottomCanvas = document.getElementById('bottomCanvas');
  const topCtx = topCanvas.getContext('2d');
  const bottomCtx = bottomCanvas.getContext('2d');
  
  const effectsContainer = document.getElementById('effectsContainer');
  const colorBtn = document.getElementById('colorBtn');
  const washBtn = document.getElementById('washBtn');
  const promptText = document.getElementById('promptText');
  const shopNowBtn = document.getElementById('shopNowBtn');
  
  let mode = 'color';
  let isDrawing = false;
  let savedPlainImageData = null;
  
  function resizeCanvas() {
    const wrapper = document.getElementById('canvasWrapper');
    const size = Math.min(wrapper.clientWidth, wrapper.clientHeight * 0.8);
    
    topCanvas.width = bottomCanvas.width = wrapper.clientWidth;
    topCanvas.height = bottomCanvas.height = wrapper.clientHeight;
    
    drawImages();
  }
  
  function drawImages() {
    if (!colorImg.complete || !plainImg.complete) return;
  
    bottomCtx.clearRect(0, 0, bottomCanvas.width, bottomCanvas.height);
    bottomCtx.drawImage(colorImg, 0, 0, bottomCanvas.width, bottomCanvas.height);
  
    topCtx.globalCompositeOperation = 'source-over';
    topCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);
    topCtx.drawImage(plainImg, 0, 0, topCanvas.width, topCanvas.height);
  
    savedPlainImageData = topCtx.getImageData(0, 0, topCanvas.width, topCanvas.height);
  }
  
  function getCanvasCoords(e) {
    const rect = topCanvas.getBoundingClientRect();
    const scaleX = topCanvas.width / rect.width;
    const scaleY = topCanvas.height / rect.height;
    
    let clientX, clientY;
    
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }
  
  function draw(x, y) {
    const radius = Math.min(topCanvas.width, topCanvas.height) * 0.05;
  
    if (mode === 'color') {
      topCtx.globalCompositeOperation = 'destination-out';
      topCtx.beginPath();
      topCtx.arc(x, y, radius, 0, Math.PI * 2);
      topCtx.fill();
    } else {
      if (!savedPlainImageData) return;
      const brushCanvas = document.createElement('canvas');
      brushCanvas.width = topCanvas.width;
      brushCanvas.height = topCanvas.height;
      const brushCtx = brushCanvas.getContext('2d');
      brushCtx.putImageData(savedPlainImageData, 0, 0);
      topCtx.globalCompositeOperation = 'source-over';
      topCtx.save();
      topCtx.beginPath();
      topCtx.arc(x, y, radius, 0, Math.PI * 2);
      topCtx.clip();
      topCtx.drawImage(brushCanvas, 0, 0);
      topCtx.restore();
    }
  
    const effect = document.createElement('div');
    effect.className = mode === 'color' ? 'sparkle' : 'bubble';
    effect.style.left = `${x - 8}px`;
    effect.style.top = `${y - 8}px`;
    effectsContainer.appendChild(effect);
    setTimeout(() => effect.remove(), 800);
  }
  
  // Touch and mouse events
  topCanvas.addEventListener('pointerdown', (e) => {
    isDrawing = true;
    const { x, y } = getCanvasCoords(e);
    draw(x, y);
  });
  
  topCanvas.addEventListener('pointermove', (e) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);
    draw(x, y);
  });
  
  topCanvas.addEventListener('pointerup', () => isDrawing = false);
  topCanvas.addEventListener('pointerleave', () => isDrawing = false);
  
  // Touch events for mobile
  topCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    const { x, y } = getCanvasCoords(e);
    draw(x, y);
  });
  
  topCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);
    draw(x, y);
  });
  
  topCanvas.addEventListener('touchend', () => isDrawing = false);
  
  colorBtn.addEventListener('click', () => {
    mode = 'color';
    colorBtn.classList.add('active');
    washBtn.classList.remove('active');
    promptText.textContent = 'Color Me!';
  });
  
  washBtn.addEventListener('click', () => {
    mode = 'wash';
    washBtn.classList.add('active');
    colorBtn.classList.remove('active');
    promptText.textContent = 'Wash Me!';
  });
  
  document.querySelectorAll('.productCard').forEach(card => {
    card.addEventListener('click', () => {
      selectedProduct = card.dataset.product;
      plainImg.src = imageData[selectedProduct].plain;
      colorImg.src = imageData[selectedProduct].color;
      shopNowBtn.href = imageData[selectedProduct].link;
  
      document.getElementById('homeView').style.display = 'none';
      document.getElementById('gameView').style.display = 'flex';
  
      plainImg.onload = resizeCanvas;
      colorImg.onload = resizeCanvas;
    });
  });
  
  document.getElementById('backBtn').addEventListener('click', () => {
    document.getElementById('gameView').style.display = 'none';
    document.getElementById('homeView').style.display = 'flex';
  });
  
  document.getElementById('closeBtn').addEventListener('click', () => {
    alert("Close clicked");
  });
  
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', resizeCanvas);
  
  // Initial resize
  resizeCanvas();
