import { fetchData } from "./../lib/hitAPIs";
import { ITrelloBoard, ITrelloList, ITrelloCard } from "./interfaces";
import { Router } from "express";
import dotenv from "dotenv";

import urls from "./urls";

dotenv.config();

const router = Router();

router.get("/", (req, res) => {
    req;
    res.send({
        hello: "Trello",
    });
});

router.get(urls.GET_TRELLO_BOARD, async (req, res) => {
    const { trelloKey, trelloToken } = req.query;

    const responseData: { trelloBoards: ITrelloBoard[] } = {
        trelloBoards: [],
    };

    let pravasBoardExists = false,
        pravasBoard: ITrelloBoard[] = [];

    await fetchData(
        `https://api.trello.com/1/members/me/boards?key=${trelloKey}&token=${trelloToken}`,
        {
            method: "get",
        }
    )
        .then(res => {
            responseData.trelloBoards = res as ITrelloBoard[];
            pravasBoard = responseData.trelloBoards.filter(
                board => board.name === "pravas-board"
            );
            pravasBoardExists = pravasBoard.length > 0;
        })
        .catch(e => console.error(e));

    if (!pravasBoardExists) {
        // CREATE BOARD
        const name = "pravas-board";
        await fetchData(
            `https://api.trello.com/1/boards/?key=${trelloKey}&token=${trelloToken}&name=${name}`,
            {
                method: "post",
            }
        )
            .then(res => {
                pravasBoard = [res as ITrelloBoard];
            })
            .catch(e => console.error(e));
    }

    res.send({
        pravasBoard: pravasBoard[0],
    });
});

router.get(urls.GET_LISTS_IN_BOARD, async (req, res) => {
    const { trelloKey, trelloToken, boardId } = req.query;

    const responseData: { listsInPravasBoard: ITrelloList[] } = {
        listsInPravasBoard: [],
    };

    await fetchData(
        `https://api.trello.com/1/boards/${boardId}/lists?key=${trelloKey}&token=${trelloToken}`,
        {
            method: "get",
        }
    )
        .then(res => {
            responseData.listsInPravasBoard = res as ITrelloList[];
        })
        .catch(e => console.error(e));

    res.send(responseData);
});

router.get(urls.GET_CARDS_IN_BOARD, async (req, res) => {
    const { trelloKey, trelloToken, boardId } = req.query;

    type ResponseData = {
        todoCards: ITrelloCard[];
        doneCards: ITrelloCard[];
        todoId: string;
        doneId: string;
    };

    const responseData: ResponseData = {
        todoCards: [],
        doneCards: [],
        todoId: "",
        doneId: "",
    };

    const listIds = {
        todoList: "",
        doneList: "",
    };

    // GET LISTS
    await fetchData(
        `https://api.trello.com/1/boards/${boardId}/lists?key=${trelloKey}&token=${trelloToken}`,
        {
            method: "get",
        }
    )
        .then(res => {
            const lists = res as ITrelloList[];

            lists.forEach(list => {
                if (list.name === "To Do") listIds.todoList = list.id;
                else if (list.name === "Done") listIds.doneList = list.id;
            });
        })
        .catch(e => console.error(e));

    responseData.todoId = listIds.todoList;
    responseData.doneId = listIds.doneList;

    await fetchData(
        `https://api.trello.com/1/boards/${boardId}/cards?key=${trelloKey}&token=${trelloToken}`,
        {
            method: "get",
        }
    )
        .then(res => {
            const cards = res as ITrelloCard[];

            cards.forEach(card => {
                let cardData = {
                    name: card.name,
                    desc: card.desc,
                    id: card.id,
                    due: card.due,
                    idList: card.idList,
                };

                if (card.idList === listIds.todoList) {
                    responseData["todoCards"].push({
                        ...cardData,
                        type: "TODO",
                    });
                } else if (card.idList === listIds.doneList) {
                    responseData["doneCards"].push({
                        ...cardData,
                        type: "DONE",
                    });
                }
            });
        })
        .catch(e => console.error(e));

    res.send(responseData);
});

router.post(urls.ADD_NEW_CARD, async (req, res) => {
    const { trelloKey, trelloToken } = req.query;
    const { listId, data } = req.body;

    const { name, desc, due } = data;

    type ResponseData = {
        addedCard?: ITrelloCard;
    };

    let responseData: ResponseData = {};

    // GET LISTS
    await fetchData(
        `https://api.trello.com/1/cards?key=${trelloKey}&token=${trelloToken}&idList=${listId}&name=${name}&desc=${desc}&due=${due}`,
        {
            method: "post",
        }
    )
        .then(res => {
            responseData = {
                addedCard: {
                    name: (res as ITrelloCard).name,
                    desc: (res as ITrelloCard).desc,
                    id: (res as ITrelloCard).id,
                    due: (res as ITrelloCard).due,
                    idList: (res as ITrelloCard).idList,
                    type: "TODO",
                },
            };
        })
        .catch(e => console.error(e));

    res.send(responseData);
});

router.put(urls.UPDATE_A_CARD, async (req, res) => {
    const { trelloKey, trelloToken, id } = req.query;
    const { listId } = req.body;

    type ResponseData = {
        updatedCard?: ITrelloCard;
    };

    let responseData: ResponseData = {};

    // GET LISTS
    await fetchData(
        `https://api.trello.com/1/cards/${id}?key=${trelloKey}&token=${trelloToken}&idList=${listId}`,
        {
            method: "put",
        }
    )
        .then(res => {
            responseData = {
                updatedCard: {
                    name: (res as ITrelloCard).name,
                    desc: (res as ITrelloCard).desc,
                    id: (res as ITrelloCard).id,
                    due: (res as ITrelloCard).due,
                    idList: (res as ITrelloCard).idList,
                    type: "TODO",
                },
            };
        })
        .catch(e => console.error(e));

    res.send(responseData);
});

router.post(urls.CREATE_TRELLO_BOARD, async (req, res) => {
    const { trelloKey, trelloToken, name } = req.query;
    const responseData: { trelloBoard: ITrelloBoard } | {} = {};

    await fetchData(
        `https://api.trello.com/1/boards/?key=${trelloKey}&token=${trelloToken}&name=${name}`,
        {
            method: "post",
        }
    )
        .then(res => {
            (responseData as { trelloBoard: ITrelloBoard }).trelloBoard =
                res as ITrelloBoard;
        })
        .catch(e => console.error(e));

    res.send(responseData);
});

export default router;
