import { something, userAuth } from "../middlewares/auth.js";
import jwt from "jsonwebtoken";
import { Hono } from "hono";

const boardRoute = new Hono();
boardRoute.use(userAuth);

boardRoute.get('/my-boards', async (req, res) => {
    try {
        const userBoards = await prismaClient.board.findMany(
            {
                where: {
                    deletedAt: null,
                    BoardCollaborators: {
                        some: {
                            collaboratorId: req.userId
                        }
                    }

                },
                include: {
                    BoardCollaborators: true,
                }
            });
        const userBoardsList = {
            userBoards: [] as any[],
            sharedBoards: [] as any[]
        };
        userBoards.forEach((board) => {
            if (board.ownerId == req.userId)
                userBoardsList.userBoards.push(board);
            else
                userBoardsList.sharedBoards.push(board);
        })
        res.json({
            message: "List of your boards",
            ownedBoardList: userBoardsList.userBoards,
            sharedBoardList: userBoardsList.sharedBoards
        });
        return;
    } catch (err) {
        console.log(JSON.stringify(err));;
        res.status(500).json({
            message: "DB error while getting boards"
        });
        return;
    }
});

// boardRoute.get('/shared-we-me', async (req, res) => {
//     try {
//         const userBoards = await prismaClient.board.findMany(
//             {
//                 where: {
//                     NOT: {
//                         ownerId: req.userId,
//                     },
//                     BoardCollaborators: {
//                         some: {
//                             collaboratorId: req.userId
//                         }
//                     }
//                 }
//             });
//         res.json({
//             message: "List of boards shared with you",
//             boardList: userBoards
//         });
//         return;
//     } catch (err: any) {
//         console.log(JSON.stringify(err));;
//         res.status(500).json({
//             message: "DB error while getting boards"
//         });
//         return;
//     }
// });

boardRoute.post('/create', async (req, res) => {
    const { success, data, error } = CreateBoard.safeParse(req.body);
    if (!success) {
        res.status(400).json({
            message: "Invalid format",
            error: error.issues
        });
        return;
    }
    try {
        const newBoard = await prismaClient.board.create({
            data: {
                boardName: data.boardName,
                slug: data.slug,
                ownerId: req.userId,
                BoardCollaborators: {
                    create: {
                        collaboratorId: req.userId,
                        collaboratorType: "EDITOR"
                    }
                }
            },
        });

        res.json({
            message: "New Board Created",
            Board: newBoard
        });
        return;
    } catch (err: any) {
        console.log(JSON.stringify(err));
        if (err.name == "PrismaClientKnownRequestError" && err.code == "P2002") {
            res.status(409).json({
                message: "Board with slug already exists",
                slug: data.slug
            });
            return;
        }
        res.status(500).json({
            message: "DB error while creating board"
        });
    }
});

boardRoute.post('/update-collaborator', async (req, res) => {
    const { success, data, error } = UpdateCollaborator.safeParse(req.body);
    if (!success) {
        res.status(400).json({
            message: "Invalid Format",
            error: error.issues
        });
        return;
    }

    try {
        const dbCollaboratorId = await prismaClient.user.findFirst({
            where: {
                userName: data.userName
            }
        });
        if (!dbCollaboratorId) {
            res.status(404).json({
                message: "User not found",
                userName: data.userName
            });
            return;
        }
        const dbBoard = await prismaClient.board.findFirst({
            where: {
                id: data.boardId
            }
        });

        if (!dbBoard) {
            res.status(404).json({
                message: "Board not found",
                userName: data.boardId
            });
            return;
        }
        if (dbBoard.ownerId === dbCollaboratorId.id) {
            res.status(403).json({
                message: "You are owner of the board"
            });
            return;
        }
        const updateCollaborator = await prismaClient.boardCollaborator.upsert({
            where: {
                collaboratorId_boardId: {
                    collaboratorId: dbCollaboratorId.id,
                    boardId: data.boardId
                },
            },
            update: {
                collaboratorType: data.collboratorType
            },
            create: {
                collaboratorId: dbCollaboratorId.id,
                boardId: data.boardId,
                collaboratorType: data.collboratorType
            }
        });
        res.json({
            message: "User permission updated",
            currentStatus: updateCollaborator.collaboratorType,
            id: updateCollaborator,
        });
        return;
    } catch (err) {
        console.log(JSON.stringify(err));;
        res.status(500).json({
            message: "Error updating collabotor"
        });
        return;
    }
});

boardRoute.get('/get-token/:boardId', async (req, res) => {
    if (!req.params.boardId) {
        res.status(400).json({
            message: "BoardId is missing"
        });
        return;
    }
    try {
        const dbBoard = await prismaClient.board.findFirst({
            where: {
                id: req.params.boardId,
            },
        });
        if (!dbBoard) {
            res.status(404).json({
                message: "Board not found"
            });
            return;
        }
        const dbCollaborator = await prismaClient.boardCollaborator.findFirst({
            where: {
                boardId: dbBoard.id,
                collaboratorId: req.userId
            }
        });
        if (!dbCollaborator) {
            const dbOwner = await prismaClient.user.findFirst({
                where: {
                    id: dbBoard.ownerId
                }
            });
            res.status(403).json({
                message: "Board is not accessible to you",
                boardOwner: dbOwner?.userName
            });
            return;
        }
        const board = {} as {
            boardId: string;
            collaboratorId: string;
            collaboratorType: string;
        };
        board.boardId = dbBoard.id;
        board.collaboratorId = dbCollaborator.collaboratorId;
        board.collaboratorType = dbCollaborator.collaboratorType;
        const wsToken = jwt.sign(board, process.env.WS_JWT_SECRET!, { expiresIn: '1d' });
        res.json({
            message: "Websocket token generated successfully",
            wsToken: wsToken
        });
        return;
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while getting board access"
        });
        return;
    }
});

boardRoute.get('/slug-board-id/:slug', async (req, res) => {
    const { success, data, error } = CreateBoard.pick({ slug: true }).safeParse(req.params);
    if (!success) {
        res.status(400).json({
            message: "Invalid Board slug",
            error: error.issues
        });
        return;
    }
    try {
        const dbBoard = await prismaClient.board.findFirst({
            where: {
                slug: data.slug
            },
            select: {
                id: true
            }
        });
        if (dbBoard) {
            res.json({
                message: "BoardId for given slug found",
                slug: data.slug,
                board: dbBoard
            });
            return;
        }
        res.status(404).json({
            message: "BoardId for given slug not found",
            slug: data.slug
        });
        return;
    } catch (err) {
        console.log(JSON.stringify(err));
        res.status(500).json({
            message: "Error while getting Id from slug"
        });
        return;
    }

})

boardRoute.get('/id-board-details/:boardId', async (req, res) => {
    if (!req.params.boardId) {
        res.status(400).json({
            message: "BoardId is Empty"
        });
    }

    try {
        const dbBoard = await prismaClient.board.findFirst({
            where: {
                id: req.params.boardId
            }
        });
        if (!dbBoard) {
            res.status(404).json({
                message: "Board not found",
                boardId: req.params.boardId
            });
            return;
        }
        const dbCollaborators = await prismaClient.boardCollaborator.findMany({
            where: {
                boardId: dbBoard.id
            }
        });
        const isCollaborator = dbCollaborators.find((collaborator) => {
            return collaborator.collaboratorId == req.userId;
        });
        if (!isCollaborator) {
            const dbOwner = await prismaClient.user.findFirst({
                where: {
                    id: dbBoard.ownerId
                }
            });
            res.status(403).json({
                message: "Board is not accessible to you",
                boardOwner: dbOwner?.userName
            });
            return;
        }
        // if collabo
        const collaborators = dbCollaborators.map((collaborator) => {
            return collaborator.collaboratorId;
        });
        res.json({
            message: "Board details",
            board: dbBoard,
            collaborators: collaborators
        });
        return;
    } catch (err) {
        console.log(JSON.stringify(err));
        res.status(500).json({
            message: "Error while getting Board data"
        });
        return;
    }
});

//get all elements 
boardRoute.get('/elements/:boardId', async (req, res) => {
    const { success, data, error } = Uuid.safeParse(req.params.boardId);
    if (!success) {
        res.status(400).json({
            message: "Invalid boardId",
            boardId: req.params.boardId
        });
        return;
    }
    try {
        const dbBoard = await prismaClient.board.findFirst({
            where: {
                id: data
            }
        });
        if (!dbBoard) {
            res.status(404).json({
                message: "Board not found",
                boardId: data
            });
            return;
        }
        const dbElements = await prismaClient.element.findMany({
            where: {
                boardId: dbBoard.id
            }
        });
        res.json({
            message: "Elements of the board",
            boardId: dbBoard.id,
            elements: dbElements
        });
        return;
    } catch (err) {
        console.log(JSON.stringify(err));
        res.status(500).json({
            message: "Error while getting elements"
        });
        return;
    }
});

export { boardRoute }