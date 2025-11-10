// import { something, userAuth } from "../middlewares/auth.js";
import jwt from "jsonwebtoken";
import { Hono } from "hono";

const boardRoute = new Hono();
boardRoute.use();

boardRoute.get('/my-boards', async (req, res) => {
});

// boardRoute.get('/shared-we-me', async (req, res) => {
// });

boardRoute.post('/create', async (req, res) => {
});

boardRoute.post('/update-collaborator', async (req, res) => {
});

boardRoute.get('/get-token/:boardId', async (req, res) => {
});

boardRoute.get('/slug-board-id/:slug', async (req, res) => {

})

boardRoute.get('/id-board-details/:boardId', async (req, res) => {
});

//get all elements 
boardRoute.get('/elements/:boardId', async (req, res) => {
});

export { boardRoute }