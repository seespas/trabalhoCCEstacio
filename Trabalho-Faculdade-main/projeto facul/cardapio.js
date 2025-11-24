let cart = []; // memoria do nosso carrinho

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Seletores do Carrinho ---
    const cartSidebar = document.getElementById('sidebar-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items'); 
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const checkoutButton = document.getElementById('checkout-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // --- Seletores do Modal de Opções ---
    const itemModal = document.getElementById('item-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemPrice = document.getElementById('modal-item-price');
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemObservation = document.getElementById('modal-item-observation');
    
    // Containers dinâmicos do Modal
    const modalSizeOptions = document.getElementById('modal-size-options');
    const modalFlavorOptions = document.getElementById('modal-flavor-options');
    const modalObservationContainer = document.getElementById('modal-observation-container');


    // --- Ouvintes de Eventos ---
    openCartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', () => { 
        closeCart();
        closeItemModal();
    }); 
    checkoutButton.addEventListener('click', handleCheckout);
    cartItemsContainer.addEventListener('click', handleCartClick);
    
    // Ouvintes do Modal de Opções
    closeModalBtn.addEventListener('click', closeItemModal);
    modalAddToCartBtn.addEventListener('click', handleModalAddToCart);

    // Ouve cliques nos botões do cardápio
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const menuItem = button.closest('.produto'); // Pega o card (agora é .produto)
            openItemModal(menuItem); // Envia o card para a função
        });
    });

    // --- Funções de Abrir/Fechar Carrinho ---
    function openCart() {
        cartSidebar.classList.add('cart-open');
        cartOverlay.classList.add('visible')
    }

    function closeCart() {
        cartSidebar.classList.remove('cart-open')
        if (!itemModal.classList.contains('visible')) {
            cartOverlay.classList.remove('visible');
        }
    }
    
    // --- Funções de Abrir/Fechar Modal de Opções (ADAPTADA) ---
    function openItemModal(menuItem) {
        // Pega todos os dados do HTML
        const name = menuItem.getAttribute('data-name');
        const price = menuItem.getAttribute('data-price');
        const itemType = menuItem.getAttribute('data-type');
        const imageSrc = menuItem.querySelector('img').src;

        // Popula o modal com dados comuns
        modalItemName.innerText = name;
        modalItemImage.src = imageSrc;
        modalItemObservation.value = ''; // Limpa observação

        // Limpa e esconde os containers de opções
        modalSizeOptions.innerHTML = '';
        modalFlavorOptions.innerHTML = '';
        modalSizeOptions.style.display = 'none';
        modalFlavorOptions.style.display = 'none';
        modalObservationContainer.style.display = 'none';

        // Guarda dados base no botão de adicionar
        modalAddToCartBtn.setAttribute('data-name', name);
        // MODIFICAÇÃO 1: Salva a imagem no botão
        modalAddToCartBtn.setAttribute('data-image-src', imageSrc); 

        // Lógica de qual tipo de item é
        if (itemType === 'complex') {
            // --- AÇAÍ (ou hambúrguer, com observação) ---
            modalItemPrice.innerText = `R$ ${parseFloat(price).toFixed(2)}`;
            modalObservationContainer.style.display = 'block'; // Mostra observação
            modalAddToCartBtn.setAttribute('data-price', price); // Preço fixo
        
        } else if (itemType === 'sized') {
            // --- PIZZAS (com tamanhos) ---
            modalSizeOptions.style.display = 'block'; // Mostra tamanhos
            modalSizeOptions.innerHTML = '<h4>Escolha o tamanho:</h4>';
            
            // Pega os preços (ADAPTADO para M, G, F)
            const priceM = menuItem.getAttribute('data-price-m');
            const priceG = menuItem.getAttribute('data-price-g');
            const priceF = menuItem.getAttribute('data-price-f');
            
            // Cria os radio buttons (ADAPTADO para M, G, F)
            modalSizeOptions.innerHTML += `
                <label class="option-label">
                    <div class="option-info">
                        <input type="radio" name="size" value="Média" data-price="${priceM}" checked>
                        <span class="radio-custom"></span>
                        <span>Média</span>
                    </div>
                    <span class="option-price">R$ ${parseFloat(priceM).toFixed(2)}</span>
                </label>
                <label class="option-label">
                    <div class="option-info">
                        <input type="radio" name="size" value="Grande" data-price="${priceG}">
                        <span class="radio-custom"></span>
                        <span>Grande</span>
                    </div>
                    <span class="option-price">R$ ${parseFloat(priceG).toFixed(2)}</span>
                </label>
                <label class="option-label">
                    <div class="option-info">
                        <input type="radio" name="size" value="Família" data-price="${priceF}">
                        <span class="radio-custom"></span>
                        <span>Família</span>
                    </div>
                    <span class="option-price">R$ ${parseFloat(priceF).toFixed(2)}</span>
                </label>
            `;
            // Define o preço inicial (do 'M' que está 'checked')
            modalItemPrice.innerText = `R$ ${parseFloat(priceM).toFixed(2)}`;
            // Adiciona ouvinte para trocar o preço
            addSizeChangeEvent();

        } else if (itemType === 'flavored') {
            // --- REFRIGERANTE (com sabores) ---
            modalFlavorOptions.style.display = 'block'; // Mostra sabores
            modalFlavorOptions.innerHTML = '<h4>Escolha o sabor:</h4>';
            modalItemPrice.innerText = `R$ ${parseFloat(price).toFixed(2)}`; // Preço é fixo
            modalAddToCartBtn.setAttribute('data-price', price); // Preço fixo
            
            const flavors = menuItem.getAttribute('data-flavors').split(','); // "Coca,Fanta" -> ["Coca", "Fanta"]
            
            flavors.forEach((flavor, index) => {
                modalFlavorOptions.innerHTML += `
                    <label class="option-label">
                        <div class="option-info">
                            <input type="radio" name="flavor" value="${flavor}" ${index === 0 ? 'checked' : ''}>
                            <span class="radio-custom"></span>
                            <span>${flavor}</span>
                        </div>
                    </label>
                `;
            });
        }

        // Mostra o modal e o overlay
        itemModal.classList.add('visible');
        cartOverlay.classList.add('visible');
    }

    function closeItemModal() {
        itemModal.classList.remove('visible');
        if (!cartSidebar.classList.contains('cart-open')) {
            cartOverlay.classList.remove('visible');
        }
    }
    
    // Função helper para atualizar o preço da Pizza/Batata
    function addSizeChangeEvent() {
        document.querySelectorAll('#modal-size-options input[name="size"]').forEach(radio => {
            radio.addEventListener('change', (event) => {
                const newPrice = event.target.getAttribute('data-price');
                modalItemPrice.innerText = `R$ ${parseFloat(newPrice).toFixed(2)}`;
            });
        });
    }

    // Função chamada pelo botão "Adicionar ao Pedido" do MODAL
    function handleModalAddToCart() {
        // Pega os dados base
        const baseName = modalAddToCartBtn.getAttribute('data-name');
        // MODIFICAÇÃO 2: Pega a imagem do botão
        const baseImageSrc = modalAddToCartBtn.getAttribute('data-image-src');
        
        let finalName = baseName;
        let finalPrice = 0;
        let finalObservation = '';

        // Verifica qual seção de opção está visível
        
        if (modalSizeOptions.style.display === 'block') {
            // --- Lógica da PIZZA ---
            const selectedSize = document.querySelector('#modal-size-options input[name="size"]:checked');
            if (!selectedSize) {
                alert('Por favor, escolha um tamanho.');
                return;
            }
            finalName = `${baseName} (${selectedSize.value})`; // Ex: "Pizza de Mussarela (Grande)"
            finalPrice = parseFloat(selectedSize.getAttribute('data-price'));
            finalObservation = ''; // Sem observação para pizza (pode ser adicionada se quiser)
            
        } else if (modalFlavorOptions.style.display === 'block') {
            // --- Lógica do REFRIGERANTE ---
            const selectedFlavor = document.querySelector('#modal-flavor-options input[name="flavor"]:checked');
            if (!selectedFlavor) {
                alert('Por favor, escolha um sabor.');
                return;
            }
            finalName = `${baseName} (${selectedFlavor.value})`; // Ex: "Refrigerante (Coca-Cola)"
            finalPrice = parseFloat(modalAddToCartBtn.getAttribute('data-price')); // Preço é fixo
            finalObservation = ''; // Sem observação

        } else if (modalObservationContainer.style.display === 'block') {
            // --- Lógica do AÇAÍ (Item "complex") ---
            finalName = baseName;
            finalPrice = parseFloat(modalAddToCartBtn.getAttribute('data-price'));
            finalObservation = modalItemObservation.value.trim();
        }

        // Adiciona ao carrinho
        addItemToCart(finalName, finalPrice, finalObservation, baseImageSrc);
        closeItemModal();
        openCart();
    }


    // --- Funções Principais do Carrinho ---

    function addItemToCart(name, price, observation, imageSrc) {
        // Agora "Pizza (M)" e "Pizza (G)" são itens diferentes
        const existingItem = cart.find(item => 
            item.name === name && item.observation === observation
        );

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1,
                observation: observation,
                imageSrc: imageSrc 
            });
        }
        updateCartDisplay();
    }

    // Lida com cliques (NÃO PRECISA MUDAR)
    function handleCartClick(event) {
        const button = event.target.closest('.qty-btn, .remove-from-cart-btn');
        if (!button) return; 

        // O 'data-name' agora será "Pizza (M)"
        const itemName = button.getAttribute('data-name');
        const itemObservation = button.getAttribute('data-observation');

        if (button.classList.contains('increase-qty-btn')) {
            increaseItemQuantity(itemName, itemObservation);
        } else if (button.classList.contains('decrease-qty-btn')) {
            decreaseItemQuantity(itemName, itemObservation);
        } else if (button.classList.contains('remove-from-cart-btn')) {
            removeItemFromCart(itemName, itemObservation);
        }
    }
    
    function increaseItemQuantity(name, observation) {
        const item = cart.find(i => i.name === name && i.observation === observation);
        if (item) {
            item.quantity++;
            updateCartDisplay();
        }
    }
    
    function decreaseItemQuantity(name, observation) {
        const item = cart.find(i => i.name === name && i.observation === observation);
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
                updateCartDisplay();
            } else {
                removeItemFromCart(name, observation); 
            }
        }
    }

    function removeItemFromCart(name, observation) {
        cart = cart.filter(item => 
            item.name !== name || item.observation !== observation
        );
        updateCartDisplay();
    }

    // MODIFICAÇÃO 4: Função 'updateCartDisplay' inteira SUBSTITUÍDA
    function updateCartDisplay() {
        const cartTotalElement = document.getElementById('cart-total');
        cartItemsContainer.innerHTML = ''; 
        
        let total = 0
        let totalQuantity = 0

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Seu carrinho está vazio.</p>';
        } else {
            cart.forEach(item => {
                const subtotal = item.price * item.quantity;
                total += subtotal; 
                totalQuantity += item.quantity; 

                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item'); 

                const observationHtml = item.observation 
                    ? `<span class="cart-item-observation">Obs: ${item.observation}</span>` 
                    : '';

                // --- ESTA É A ESTRUTURA HTML CORRETA ---
                cartItemElement.innerHTML = `
                    <img src="${item.imageSrc}" alt="${item.name}" class="cart-item-image">
                    
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        ${observationHtml}
                        <span class="cart-item-price">R$ ${subtotal.toFixed(2)}</span>
                        <div class="cart-item-qty">
                            <button class="qty-btn decrease-qty-btn" data-name="${item.name}" data-observation="${item.observation}">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="qty-btn increase-qty-btn" data-name="${item.name}" data-observation="${item.observation}">+</button>
                        </div>
                    </div>
                    
                    <button class="remove-from-cart-btn" data-name="${item.name}" data-observation="${item.observation}">X</button>
                `;
                // --- FIM DA ESTRUTURA ---
                
                cartItemsContainer.append(cartItemElement);
            });
        }

        cartTotalElement.innerText = `Total: R$ ${total.toFixed(2)}`;
        openCartBtn.innerText = `Ver Carrinho (${totalQuantity})`;
    }


    function handleCheckout() {
        // MUDE ESTE NÚMERO para o WhatsApp da sua loja
        const phoneNumber = "5521988902019"; 
        const address = document.getElementById('address-input').value;
        const paymentMethod = document.getElementById('payment-method').value;

        if (cart.length === 0) {
            alert("Seu carrinho esta vazio");
            return;
        }
        if (address.trim() === "") {
            alert("Por favor, informe seu endereco.");
            return;
        }

        let message = "Olá, gostaria de fazer um pedido:\n\n"
        let total = 0;

        cart.forEach(item => {
            // O 'item.name' já é o nome completo (ex: "Pizza (M)")
            message += `*Item:* ${item.name}\n`;
            
            if (item.observation) {
                message += `*Obs:* ${item.observation}\n`;
            }
            
            message += `*Qtd:* ${item.quantity}\n`;
            message += `*Subtotal:* R$ ${(item.price * item.quantity).toFixed(2)}\n`;
            message += "-------------------------\n";
            total += item.price * item.quantity;
        });

        message += `\n*Total do Pedido: R$ ${total.toFixed(2)}*\n\n`;
        message += `*Método de Pagamento:* ${paymentMethod}\n`;
        message += `*Endereço de Entrega:* ${address}\n`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

        window.open(whatsappURL, '_blank');
    }

    // Chama no início
    updateCartDisplay();
});