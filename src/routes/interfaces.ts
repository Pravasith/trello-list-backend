
export interface ITrelloBoard {
    name: string
    desc: string
    id: string
}

export interface ITrelloList {
    name: string
    id: string
}

export interface ITrelloCard {
    name: string
    desc: string
    id: string
    due: Date
    idList: string
    type: 'TODO' | 'DONE'
}