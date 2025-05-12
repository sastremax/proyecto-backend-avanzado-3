import config from '../config/config.js';

let userManager;
let productManager;
let cartManager;
let ticketManager;

switch (config.persistence) {
    case 'MEMORY': {
        const { MemoryUserManager } = await import('./memory/MemoryUserManager.js');
        userManager = new MemoryUserManager();
        break;
    }
    case 'MONGO': 
    default: {
        const { UserManager } = await import('./mongo/UserManager.js');
        const { ProductManager } = await import('./mongo/ProductManager.js');
        const { CartManager } = await import('./mongo/CartManager.js');
        const { TicketManager } = await import('./mongo/TicketManager.js');
    
        userManager = new UserManager();
        productManager = new ProductManager();
        cartManager = new CartManager();
        ticketManager = new TicketManager();
        break;
    }    
}

const dao = {
    userManager,
    productManager,
    cartManager,
    ticketManager
};

export default dao;