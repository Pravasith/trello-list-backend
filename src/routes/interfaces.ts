
export interface ITrelloBoard {
    name: string
    desc: string
    id: string
    url: string
    prefs: {
        backgroundImage: string
    }
}

export interface ITrelloList {
    name: string
    id: string
}