import { ICatalogRepository } from "../../interface/catalogRepository.interface";
import { Product } from "../../models/product.model";
import { MockCatalogRepository } from "../../repository/mockCatalog.repository";
import { CatalogService } from "../catalog.service";
import { faker } from "@faker-js/faker";
import { Factory } from "rosie";

const productFactory = new Factory<Product>()
  .attr("id", faker.number.int({ min: 1, max: 1000 }))
  .attr("name", faker.commerce.productName())
  .attr("description", faker.commerce.productDescription())
  .attr("price", +faker.commerce.price())
  .attr("stock", faker.number.int({ min: 1, max: 100 }));

const mockProduct = (rest: any) => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 1, max: 100 }),
    ...rest,
  };
};

describe("catalogService", () => {
  let repository: ICatalogRepository;

  beforeEach(() => {
    repository = new MockCatalogRepository();
  });

  afterEach(() => {
    repository = {} as ICatalogRepository;
  });

  describe("createProduct", () => {
    test("should create a product", async () => {
      const reqBody = mockProduct({
        price: +faker.commerce.price(),
      });
      const service = new CatalogService(repository);
      const result = await service.creatProduct(reqBody);
      expect(result).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });
    test("should throw an error if the product already exists", async () => {
      const reqBody = mockProduct({
        price: +faker.commerce.price(),
      });
      const service = new CatalogService(repository);

      jest
        .spyOn(repository, "create")
        .mockImplementation(() => Promise.resolve({} as Product));

      await expect(service.creatProduct(reqBody)).rejects.toThrow(
        "Unable to create product"
      );
    });

    test("should throw an error if the product already exists", async () => {
      const reqBody = mockProduct({
        price: +faker.commerce.price(),
      });
      const service = new CatalogService(repository);

      jest
        .spyOn(repository, "create")
        .mockImplementation(() =>
          Promise.reject(new Error("product already exists"))
        );
      await expect(service.creatProduct(reqBody)).rejects.toThrow(
        "product already exists"
      );
    });
  });

  describe("updateProduct", () => {
    test("should create a product", async () => {
      const reqBody = mockProduct({
        price: +faker.commerce.price(),
        id: faker.number.int({ min: 1, max: 1000 }),
      });
      const service = new CatalogService(repository);
      const result = await service.updateProduct(reqBody);
      expect(result).toMatchObject(reqBody);
    });
    test("should throw an error if the product does not exists", async () => {
      const service = new CatalogService(repository);

      jest
        .spyOn(repository, "update")
        .mockImplementation(() =>
          Promise.reject(new Error("product does not exists"))
        );

      await expect(service.updateProduct({})).rejects.toThrow(
        "product does not exists"
      );
    });
  });

  describe("getProducts", () => {
    test("should get product by offset and limit", async () => {
      const service = new CatalogService(repository);
      const randomLimit = faker.number.int({ min: 1, max: 10 });
      const products = productFactory.buildList(randomLimit);

      jest
        .spyOn(repository, "find")
        .mockImplementation(() => Promise.resolve(products));

      const result = await service.getProducts(randomLimit, 0);
      expect(result).toHaveLength(randomLimit);
      expect(result).toMatchObject(products);
    });

    test("should throw error with product does not exist", async () => {
      const service = new CatalogService(repository);
      jest
        .spyOn(repository, "find")
        .mockImplementation(() =>
          Promise.reject(new Error("product does not exists"))
        );

      expect(service.getProducts(0, 0)).rejects.toThrow(
        "product does not exists"
      );
    });
  });

  describe("getProduct", () => {
    test("should get product by id", async () => {
      const service = new CatalogService(repository);
      const product = productFactory.build();

      jest
        .spyOn(repository, "findOne")
        .mockImplementation(() => Promise.resolve(product));

      const result = await service.getProduct(product.id);
      expect(result).toMatchObject(product);
    });
  });
});
