import core from "./core";
import express from "express";

export default (app: express.Application) => {
    core(app);
}
