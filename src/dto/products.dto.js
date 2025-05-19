export class ProductsDTO {
    constructor(product) {
        this.productName = product.title;
        this.productDescription = product.description;
        this.price = product.price;
        this.stock = product.stock;
        this.category = product.category;
        this.status = product.status || 'available';
        this.thumbnails = product.thumbnails;
    }
}