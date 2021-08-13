import express from "express";
import root from './impl/root';

export default (app: express.Application) => {
    app.use('/', root);
}
