import { Router, type IRouter } from "express";
import healthRouter from "./health";
import liveRussiaRouter from "./live-russia";

const router: IRouter = Router();

router.use(healthRouter);
router.use(liveRussiaRouter);

export default router;
