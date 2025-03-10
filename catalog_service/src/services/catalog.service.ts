import { ICatalogRepository } from "../interface/catalogRepository.interface";

export class CatalogService {
  private _repository: ICatalogRepository;

  constructor(repository: ICatalogRepository) {
    this._repository = repository;
  }

  async creatProduct(input: any) {
    const data = await this._repository.create(input);
    if (!data.id) throw new Error("Unable to create product");
    return data;
  }
  async updateProduct(input: any) {
    const data = await this._repository.update(input);
    // emit event to elastic search
    return data;
  }

  // In Future instead of this we will get the data from elastic search
  async getProduct(id: number) {
    const product = await this._repository.findOne(id);
    return product;
  }

  // In Future instead of this we will get the data from elastic search
  async getProducts(limit: number, offset: number) {
    const products = await this._repository.find(limit, offset);
    return products;
  }

  async deleteProduct(id: number) {
    const response = await this._repository.delete(id);
    // delete record from Elastic search
    return response;
  }

}
