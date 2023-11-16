import productsModel from "../models/products.model.js";

export default class ProductManager {
    getProducts = async (limit = 10, pageNum = 1) => {
        try {
            const options = { limit: Number(limit), page: Number(pageNum) };
            const products = await productsModel.paginate({}, options);
            const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = products;
            const prevLink = hasPrevPage ? `/api/products/?limit=${limit}&page=${prevPage}` : null;
            const nextLink = hasNextPage ? `/api/products/?limit=${limit}&page=${nextPage}` : null;
            return {
                status: "All products:",
                payload: docs,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
            };
        } catch (err) {
            console.log(err);
        }
    };

    addProduct = async (product) => {
        try {
            const checkProduct = await productsModel.findOne({
                code: `${Number(product.code)}`,
            });
            if (checkProduct) {
                return checkProduct;
            }
            const newProduct = await productsModel.create({
                ...product,
                code: Number(product.code),
            });
            return newProduct;
        } catch (err) {
            console.log(err);
        }
    };
}