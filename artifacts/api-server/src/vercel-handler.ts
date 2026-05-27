import "dotenv/config";
import app from "./app";

export default (req: any, res: any) => app(req, res);
