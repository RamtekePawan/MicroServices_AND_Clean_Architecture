import { Request, Response, NextFunction, Router } from "express";

const router = Router();

router.post("/product", (req: Request, res: Response, next: NextFunction) => {
  // Your handler logic here
  res.status(201).json({ msg: "Product API" });
});

export default router;
